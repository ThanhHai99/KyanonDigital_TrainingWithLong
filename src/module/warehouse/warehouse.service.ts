import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, getManager, MoreThan, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';
import { ItemService } from '@module/item/item.service';
import { isArraysSameLength } from '@shared/utils/array';
import { Item } from '@module/item/item.entity';
import { BodyImporting } from './warehouse.dto';

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
      relations: ['item']
    });
  }

  async getById(id: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOne(id, {
      relations: ['item']
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
    transactionEntityManager: EntityManager,
    data: BodyImporting
  ): Promise<any> {
    // Check data is valid
    if (
      data.item_id.length < 0 ||
      !isArraysSameLength(
        data.item_id,
        data.amount,
        data.expiration_date,
        data.price
      )
    ) {
      throw new HttpException('The data is invalid', HttpStatus.CONFLICT);
    }

    for (let i = 0; i < data.item_id.length; i++) {
      await transactionEntityManager
        .insert(Warehouse, {
          item: data.item_id[i],
          amount: data.amount[i],
          expiration_date: data.expiration_date[i]
        })
        .then(async (resolve) => {
          // Create a warehouse log
          await this.warehouseLogService.create(transactionEntityManager, {
            status: '+',
            price: data.price[i],
            warehouse: resolve.raw.insertId,
            item: data.item_id[i],
            amount: data.amount[i],
            expiration_date: data.expiration_date[i],
            created_by: data.user
          });
        })
        .catch((reject) => {
          throw new HttpException(
            'The warehouse cannot create',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
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

  async exportProduct(
    transactionEntityManager: EntityManager,
    itemInOrder: ItemOrder[],
    userId: number
  ): Promise<any> {
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
        await transactionEntityManager.save(warehouse[j]);

        // Create a warehouse log
        const item = await this.itemService.findById(itemId);
        await this.warehouseLogService.create(transactionEntityManager, {
          status: '-',
          price: item.price,
          warehouse: warehouse[j].id,
          item: item.id,
          amount: _amount,
          expiration_date: warehouse[j].expiration_date,
          created_by: userId
        });

        _amount -= tmpAmount;
        if (_amount <= 0) break;
      }
    }
  }
}
