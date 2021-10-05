import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getManager, MoreThan, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';
import { ItemService } from '@module/item/item.service';
import { isArraysSameLength } from '@shared/utils/array';
import { Item } from '@module/item/item.entity';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly warehouseLogService: WarehouseLogService,
    private readonly itemService: ItemService,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>
  ) {}

  async getAll(): Promise<Warehouse[]> {
    return await this.warehouseRepository.find({
      join: {
        alias: 'warehouse',
        leftJoinAndSelect: {
          item: 'warehouse.item'
        }
      }
    });
  }

  async getById(id: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOne({
      where: {
        id: id
      },
      join: {
        alias: 'warehouse',
        leftJoinAndSelect: {
          item: 'warehouse.item'
        }
      }
    });
  }

  async getInventory(): Promise<Warehouse[]> {
    return await this.warehouseRepository.find({
      expiration_date: Raw(
        (alias) => `${alias} < DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)`
      )
    });
  }

  async create(
    itemId: Array<number>,
    amount: Array<number>,
    expirationDate: Array<Date>,
    price: Array<number>,
    userId: number
  ): Promise<any> {
    // Check data is valid
    if (
      itemId.length < 0 ||
      !isArraysSameLength(itemId, amount, expirationDate, price)
    )
      throw new HttpException('The data is invalid', HttpStatus.CONFLICT);

    for (let i = 0; i < itemId.length; i++) {
      // Create a warehouse
      const newWarehouse = new Warehouse();
      newWarehouse.item = itemId[i];
      newWarehouse.amount = amount[i];
      newWarehouse.expiration_date = expirationDate[i];
      let result = await this.warehouseRepository.insert(newWarehouse);
      if (!result) {
        throw new HttpException(
          'The warehouse cannot create',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Create a warehouse log
      await this.warehouseLogService.create(
        '+',
        price[i],
        result.raw.insertId,
        itemId[i],
        amount[i],
        expirationDate[i],
        userId
      );
    }
  }

  /**
   * Check if the number of products in the order is enough to be shipped or not?
   * @returns
   */
  async isEnoughQuantityToExport(itemInOrder: ItemOrder[]): Promise<boolean> {
    const itemOrderManager = getManager();
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item, amount } = itemInOrder[i];
      let _item: Item = <Item>item;
      const { id: itemId } = _item;

      const currentQuantityOfItem = await itemOrderManager.query(`
        SELECT SUM(amount) as sumAmount
        FROM warehouse
        WHERE item_id = ${itemId}
        AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
      `);

      if (currentQuantityOfItem[0].sumAmount < amount)
        throw new HttpException('Item quantity is not enough', HttpStatus.OK);
    }
    return true;
  }

  async exportProduct(itemInOrder: ItemOrder[], userId: number): Promise<any> {
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item, amount } = itemInOrder[i];
      let _item: Item = <Item>item;
      const { id: itemId } = _item;
      let _amount = amount;

      let warehouse = await this.warehouseRepository.find({
        where: {
          item: itemId,
          amount: MoreThan(0),
          expiration_date: Raw(
            (e) => `${e} > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)`
          )
        },
        order: { expiration_date: 'ASC' },
        relations: ['item']
      });

      for (let j = 0; j < warehouse.length; j++) {
        let tmpAmount = warehouse[j].amount;
        warehouse[j].amount =
          warehouse[j].amount <= _amount ? 0 : warehouse[j].amount - _amount;
        await this.warehouseRepository.update(warehouse[j].id, warehouse[j]);

        // Create a warehouse log
        const item = await this.itemService.findById(itemId);
        await this.warehouseLogService.create(
          '-',
          item.price,
          warehouse[j].id,
          item.id,
          _amount,
          warehouse[j].expiration_date,
          userId
        );

        _amount -= tmpAmount;
        if (_amount <= 0) break;
      }
    }
    return;
  }
}
