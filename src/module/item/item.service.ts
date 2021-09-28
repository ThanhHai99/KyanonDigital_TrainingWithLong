import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { getManager, InsertResult, Repository, UpdateResult } from 'typeorm';
import { ItemLog } from '@module/item_log/item_log.entity';
import { PriceLog } from '@module/price_log/price_log.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,

    @InjectRepository(ItemLog)
    private itemLogRepository: Repository<ItemLog>,

    @InjectRepository(PriceLog)
    private priceLogRepository: Repository<PriceLog>
  ) {}

  async findOne(name: string): Promise<Item> {
    return await this.itemRepository.findOne({ where: { name: name } });
  }

  async getAll(name?: string): Promise<Item[]> {
    const itemManager = getManager();
    if (name)
      return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_SUB(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.name LIKE '%${name}%'
        GROUP BY item.name
    `);
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_SUB(DATE(NOW()), INTERVAL 1 MONTH)
        GROUP BY item.name
    `);
  }

  async getById(id: number): Promise<Item> {
    const itemManager = getManager();
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_SUB(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.id = ${id}
        GROUP BY item.name
    `);
  }

  async create(
    name: string,
    category_id: number,
    detail: string,
    user_manual: string,
    price: number,
    user_id: number
  ): Promise<InsertResult> {
    const isItemExists = await this.findOne(name);
    if (isItemExists)
      throw new HttpException('The item already in use', HttpStatus.CONFLICT);

    const newItem = new Item();
    newItem.name = name;
    newItem.category = category_id;
    newItem.detail = detail;
    newItem.user_manual = user_manual;
    newItem.price = price;
    newItem.user = user_id;
    const result = await this.itemRepository.insert(newItem);
    if (!result) {
      throw new HttpException(
        'The item cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newItemLog = new ItemLog();
    newItemLog.item = result.raw.insertId;
    newItemLog.name = name;
    newItemLog.category = category_id;
    newItemLog.detail = detail;
    newItemLog.user_manual = user_manual;
    newItemLog.created_by = user_id;
    await this.itemLogRepository.insert(newItemLog);

    const newPriceLog = new PriceLog();
    newPriceLog.item_id = result.raw.insertId;
    newPriceLog.price = newItem.price;
    newPriceLog.created_by = user_id;
    await this.priceLogRepository.insert(newPriceLog);

    return result;
  }

  async update(
    id: number,
    name: string,
    category_id: number,
    detail: string,
    user_manual: string,
    price: number,
    user_id: number
  ): Promise<UpdateResult> {
    const isItemExists = await this.findOne(name);
    if (isItemExists)
      throw new HttpException('The item already in use', HttpStatus.CONFLICT);

    const item = await this.itemRepository.findOne({ where: { id: id } });
    item.name = name || item.name;
    item.category = category_id || item.category;
    item.detail = detail || item.detail;
    item.user_manual = user_manual || item.user_manual;
    item.price = price || item.price;
    item.user = user_id;
    const result = await this.itemRepository.update(id, item);
    if (!result) {
      throw new HttpException(
        'The item cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newItemLog = new ItemLog();
    newItemLog.item_id = item.id;
    newItemLog.name = item.name;
    newItemLog.category = item.category;
    newItemLog.detail = detail;
    newItemLog.user_manual = user_manual;
    newItemLog.created_by = user_id;
    await this.itemLogRepository.insert(newItemLog);

    if (price) {
      const newPriceLog = new PriceLog();
      newPriceLog.item_id = id;
      newPriceLog.price = item.price;
      newPriceLog.created_by = user_id;
      await this.priceLogRepository.insert(newPriceLog);
    }

    return result;
  }
}
