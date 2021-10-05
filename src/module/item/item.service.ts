import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { getManager, Repository } from 'typeorm';
import { ItemLogService } from '@module/item_log/item_log.service';
import { PriceLogService } from '@module/price_log/price_log.service';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemLogService: ItemLogService,
    private readonly priceLogService: PriceLogService,

    @InjectRepository(Item)
    private itemRepository: Repository<Item>
  ) {}

  async findOneByName(name: string): Promise<Item> {
    return await this.itemRepository.findOne({ where: { name: name } });
  }

  async findById(id: number): Promise<Item> {
    return await this.itemRepository.findOne(id);
  }

  async getAll(name?: string): Promise<Item[]> {
    const itemManager = getManager();
    if (name)
      return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.name LIKE '%${name}%'
        GROUP BY item.name
    `);
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        GROUP BY item.name
    `);
  }

  async getById(id: number): Promise<Item> {
    const itemManager = getManager();
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.id = ${id}
        GROUP BY item.name
    `);
  }

  async create(
    name: string,
    categoryId: number,
    detail: string,
    userManual: string,
    price: number,
    userId: number
  ): Promise<Item> {
    // Check item name exists
    const isItemExists = await this.findOneByName(name);
    if (isItemExists)
      throw new HttpException('The item already in use', HttpStatus.CONFLICT);

    // Create item
    const newItem = new Item();
    newItem.name = name;
    newItem.category = categoryId;
    newItem.detail = detail;
    newItem.user_manual = userManual;
    newItem.price = price;
    newItem.user = userId;
    const result = await this.itemRepository.save(newItem);
    if (!result) {
      throw new HttpException(
        'The item cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create item log
    await this.itemLogService.create(
      result.id,
      name,
      categoryId,
      detail,
      userManual,
      userId
    );

    // Create price log
    await this.priceLogService.create(result.id, newItem.price, userId);

    return result;
  }

  async update(
    id: number,
    name: string,
    categoryId: number,
    detail: string,
    userManual: string,
    price: number,
    userId: number
  ): Promise<Item> {
    // Check item exists
    const isItemExists = await this.findOneByName(name);
    if (isItemExists)
      throw new HttpException('The item already in use', HttpStatus.CONFLICT);

    // Update item
    const item = await this.findById(id);
    if (!item)
      throw new HttpException('The item is not found', HttpStatus.NOT_FOUND);

    item.name = name || item.name;
    item.category = categoryId || item.category;
    item.detail = detail || item.detail;
    item.user_manual = userManual || item.user_manual;
    item.price = price || item.price;
    item.user = userId;
    const result = await this.itemRepository.save(item);
    if (!result)
      throw new HttpException(
        'The item cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // Create item log
    await this.itemLogService.create(
      item.id,
      item.name,
      item.category,
      item.detail,
      item.user_manual,
      userId
    );

    // Create price log
    if (price) await this.priceLogService.create(id, item.price, userId);

    return result;
  }
}
