import { Item } from '@module/item/item.entity';
import { ItemService } from '@module/item/item.service';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { BodyCreateSaleItem } from '@module/sale_item/sale_item.dto';
import { SaleItemService } from '@module/sale_item/sale_item.service';
import { SaleLogService } from '@module/sale_log/sale_log.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArraysSameLength } from '@shared/utils/array';
import { EntityManager, getManager, Repository } from 'typeorm';
import { BodyCreateSale, BodyUpdateSale } from './sale.dto';
import { Sale } from './sale.entity';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleLogService: SaleLogService,
    private readonly saleItemService: SaleItemService,
    private readonly itemService: ItemService,

    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>
  ) {}

  async findByCode(code: string): Promise<Sale> {
    return await this.saleRepository.findOne({
      where: {
        code: code
      }
    });
  }

  async getAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['sale_items', 'sale_items.item']
    });
  }

  async getById(id: number): Promise<Sale> {
    return this.saleRepository.findOne(id, {
      relations: ['sale_items', 'sale_items.item']
    });
  }

  async create(
    transactionEntityManager: EntityManager,
    dataCreateSale: BodyCreateSale,
    dataCreateSaleItem: BodyCreateSaleItem
  ): Promise<any> {
    // Check sale code exists
    const isSaleExists = await this.findByCode(dataCreateSale.code);
    if (isSaleExists)
      throw new HttpException(
        'The sale code already in use',
        HttpStatus.CONFLICT
      );

    // Validate item length vs amount length
    if (
      dataCreateSaleItem.item_id.length < 1 ||
      !isArraysSameLength(dataCreateSaleItem.item_id, dataCreateSaleItem.amount)
    )
      throw new HttpException('The data is invalid', HttpStatus.CONFLICT);

    // Create a sale
    await transactionEntityManager
      .insert(Sale, dataCreateSale)
      .then(async (resolve) => {
        // Create item of sale
        dataCreateSaleItem.sale = resolve.raw.insertId;
        await this.saleItemService.create(
          transactionEntityManager,
          dataCreateSaleItem
        );

        // Create a sale log
        await this.saleLogService.create(transactionEntityManager, {
          name: dataCreateSale.name,
          sale: resolve.raw.insertId,
          sale_item: dataCreateSaleItem.item_id.toString(),
          start_date: dataCreateSale.start_date,
          end_date: dataCreateSale.end_date,
          amount: dataCreateSaleItem.amount.toString(),
          discount: dataCreateSale.discount,
          applied: dataCreateSale.applied,
          code: dataCreateSale.code,
          created_by: dataCreateSale.user
        });
      })
      .catch((reject) => {
        throw new HttpException(
          'The sale cannot create',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  async update(
    transactionEntityManager: EntityManager,
    id: number,
    data: BodyUpdateSale
  ): Promise<any> {
    const sale = await this.saleRepository.findOne(id);
    if (!sale)
      throw new HttpException('Sale is not found', HttpStatus.NOT_FOUND);

    if (sale.applied)
      throw new HttpException('Sale is applied cannot update', HttpStatus.OK);

    if (data.code) {
      const isCodeExists = await this.findByCode(data.code);
      if (isCodeExists)
        throw new HttpException('The code already in use', HttpStatus.CONFLICT);
    }

    // Update a sale
    await transactionEntityManager
      .update(Sale, id, data)
      .then(async (resolve) => {
        const _sale = await transactionEntityManager.findOne(Sale, id);
        // Create a sale log
        const t = await this.saleItemService.findItemAndAmountBySaleId(id);
        const sale_item: string = t.map((e) => e.item.id).toString();
        const amount: string = t.map((e) => e.amount).toString();
        await this.saleLogService.create(transactionEntityManager, {
          name: _sale.name,
          sale: id,
          sale_item: sale_item.toString(),
          start_date: _sale.start_date,
          end_date: _sale.end_date,
          amount: amount.toString(),
          discount: _sale.discount,
          applied: _sale.applied,
          code: _sale.code,
          created_by: data.user
        });
      });
  }

  async isSaleStillApply(code: string): Promise<boolean> {
    const saleManager = getManager();
    const sale = await saleManager.query(`
      SELECT *
      FROM sale
      WHERE code = '${code}'
      AND applied = 1
      AND(start_date IS NULL OR start_date <= DATE(NOW()))
      AND(end_date IS NULL OR end_date >= DATE(NOW()))
    `);
    if (sale.length) return true;
    return false;
  }

  async totalDecreaseCostByCode(
    transactionEntityManager: EntityManager,
    itemInOrder: ItemOrder[],
    code: string
  ): Promise<number> {
    const isSaleStillApply = await this.isSaleStillApply(code);
    if (!isSaleStillApply) return 0;
    const sale = await this.findByCode(code);

    let total = 0;
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item, amount } = itemInOrder[i];
      let _item: Item = <Item>item;
      const { id: itemId } = _item;
      const isItemStillOnSale = await this.saleItemService.isItemStillOnSale(
        sale.id,
        <number>itemId
      );
      if (isItemStillOnSale) {
        const item = await this.itemService.findById(<number>itemId);
        total += ((item.price * sale.discount) / 100) * amount;
        await this.saleItemService.updateAmount(
          transactionEntityManager,
          sale.id,
          <number>itemId,
          amount
        );
      }
    }

    return total;
  }
}
