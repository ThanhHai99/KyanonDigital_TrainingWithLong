import { Item } from '@module/item/item.entity';
import { ItemService } from '@module/item/item.service';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { SaleItemService } from '@module/sale_item/sale_item.service';
import { SaleLogService } from '@module/sale_log/sale_log.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArraysSameLength } from '@shared/utils/array';
import { Raw, Repository } from 'typeorm';
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
  ): Promise<Sale> {
    // Check sale code exists
    const isSaleExists = await this.findByCode(code);
    if (isSaleExists)
      throw new HttpException(
        'The sale code already in use',
        HttpStatus.CONFLICT
      );

    // Validate item length vs amount length
    if (itemId.length < 1 || !isArraysSameLength(itemId, amount))
      throw new HttpException('The data is invalid', HttpStatus.CONFLICT);

    // Create a sale
    const newSale = new Sale();
    newSale.name = name;
    newSale.start_date = startDate;
    newSale.end_date = endDate;
    newSale.discount = discount;
    newSale.applied = applied;
    newSale.code = code;
    newSale.user = userId;
    const result = await this.saleRepository.save(newSale);
    if (!result)
      throw new HttpException(
        'The sale cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // Create item of sale
    for (let i = 0; i < itemId.length; i++) {
      await this.saleItemService.create(result.id, itemId[i], amount[i]);
    }

    // Create a sale log
    await this.saleLogService.create(
      name,
      result.id,
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
  ): Promise<Sale> {
    const sale = await this.saleRepository.findOne(id);
    if (!sale)
      throw new HttpException('Sale is not found', HttpStatus.NOT_FOUND);

    if (sale.applied)
      throw new HttpException('Sale is applied cannot update', HttpStatus.OK);

    if (code) {
      const isCodeExists = await this.findByCode(code);
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
    const result = await this.saleRepository.save(sale);

    // Create a sale log
    const t = await this.saleItemService.findItemAndAmountBySaleId(id);
    const sale_item: string = t.map((e) => e.item.id).toString();
    const amount: string = t.map((e) => e.amount).toString();
    await this.saleLogService.create(
      sale.name,
      id,
      sale_item.toString(),
      sale.start_date,
      sale.end_date,
      amount.toString(),
      sale.discount,
      sale.applied,
      sale.code,
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
          sale.id,
          <number>itemId,
          amount
        );
      }
    }

    return total;
  }
}
