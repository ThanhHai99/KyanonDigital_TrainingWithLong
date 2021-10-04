import { ItemService } from '@module/item/item.service';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { SaleItem } from '@module/sale_item/sale_item.entity';
import { SaleItemService } from '@module/sale_item/sale_item.service';
import { SaleLogService } from '@module/sale_log/sale_log.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Raw, Repository, UpdateResult } from 'typeorm';
import { Sale } from './sale.entity';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleLogService: SaleLogService,
    private readonly saleItemService: SaleItemService,
    private readonly itemService: ItemService,

    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,

    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>
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
      join: {
        alias: 'sale',
        leftJoinAndSelect: {
          sale_item: 'sale.sale_item'
        }
      }
    });
  }

  async getById(id: number): Promise<Sale> {
    return this.saleRepository.findOne({
      where: {
        id: id
      },
      join: {
        alias: 'sale',
        leftJoinAndSelect: {
          sale_item: 'sale.sale_item'
        }
      }
    });
  }

  async create(
    name: string,
    startDate: Date,
    endDate: Date,
    discount: number,
    applied: boolean,
    code: string,
    userId: number,
    itemId: Array<number>,
    amount: Array<number>
  ): Promise<InsertResult> {
    // Check sale code exists
    const isSaleExists = await this.saleRepository.findOne({
      where: { code: code }
    });
    if (isSaleExists)
      throw new HttpException('The sale already in use', HttpStatus.CONFLICT);

    // Validate item length vs amount length
    if (itemId.length < 1 && itemId.length !== amount.length)
      throw new HttpException(
        'Item or amount of item invalid',
        HttpStatus.CONFLICT
      );

    // Create a sale
    const newSale = new Sale();
    newSale.name = name;
    newSale.start_date = startDate;
    newSale.end_date = endDate;
    newSale.discount = discount;
    newSale.applied = applied;
    newSale.code = code;
    newSale.user = userId;
    const result = await this.saleRepository.insert(newSale);
    if (!result)
      throw new HttpException(
        'The sale cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // Create sale item
    for (let i = 0; i < itemId.length; i++) {
      await this.saleItemService.create(
        result.raw.insertId,
        itemId[i],
        amount[i]
      );
    }

    // Create a sale log
    await this.saleLogService.create(
      name,
      result.raw.insertId,
      itemId.toString(),
      startDate,
      endDate,
      amount.toString(),
      discount,
      applied,
      code,
      userId
    );

    return result;
  }

  async update(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    discount: number,
    applied: boolean,
    code: string,
    userId: number
  ): Promise<UpdateResult> {
    const sale = await this.saleRepository.findOne({ where: { id: id } });
    if (!sale)
      throw new HttpException('Sale is not found', HttpStatus.NOT_FOUND);

    if (sale.applied)
      throw new HttpException('Sale is applied', HttpStatus.NO_CONTENT);

    if (code) {
      const isCodeExists = await this.saleRepository.findOne({
        where: { code: code }
      });
      if (isCodeExists)
        throw new HttpException('The code already in use', HttpStatus.CONFLICT);
    }

    // Update a sale
    sale.name = name || sale.name;
    sale.start_date = startDate || sale.start_date;
    sale.end_date = endDate || sale.end_date;
    sale.discount = discount || sale.discount;
    sale.applied = applied || sale.applied;
    sale.code = code || sale.code;
    sale.user = userId;
    const result = await this.saleRepository.update(id, sale);

    // Create a sale log
    const t: SaleItem[] = await this.saleItemRepository.find({
      select: ['item', 'amount'],
      where: {
        sale: sale.id
      }
    });
    const sale_item: string = t.map((e) => e.item).toString();
    const amount: string = t.map((e) => e.amount).toString();
    await this.saleLogService.create(
      name,
      id,
      sale_item.toString(),
      startDate,
      endDate,
      amount.toString(),
      discount,
      applied,
      code,
      userId
    );

    return result;
  }

  async isSaleStillApply(code: string): Promise<boolean> {
    const sale = await this.saleRepository.findOne({
      where: {
        applied: 1,
        code: code,
        start_date: Raw((alias) => `${alias} IS NULL OR ${alias} <= NOW()`),
        end_date: Raw((alias) => `${alias} IS NULL OR ${alias} > NOW()`)
      }
    });
    if (sale) return true;
    return false;
  }

  async totalDecreaseCostByCode(
    itemInOrder: ItemOrder[],
    code: string
  ): Promise<number> {
    const isSaleStillApply = await this.isSaleStillApply(code);
    if (!isSaleStillApply) return 0;
    const sale = await this.findByCode(code);

    let total = 0;
    for (let i = 0; i < itemInOrder.length; i++) {
      const { item: itemId, amount } = itemInOrder[i];
      const isItemStillOnSale = await this.saleItemService.isItemStillOnSale(
        sale.id,
        <number>itemId
      );
      if (isItemStillOnSale) {
        const item = await this.itemService.findById(<number>itemId);
        total += ((item.price * sale.discount) / 100) * amount;
        await this.saleItemService.updateAmount(
          sale.id,
          <number>itemId,
          amount
        );
      }
    }

    return total;
  }
}
