import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Item } from './item.entity'
import { EntityManager, getManager, Repository } from 'typeorm'
import { ItemLogService } from '@module/item_log/item_log.service'
import { PriceLogService } from '@module/price_log/price_log.service'
import { BodyCreateItem, BodyUpdateItem } from './item.dto'

@Injectable()
export class ItemService {
  constructor(
    private readonly itemLogService: ItemLogService,
    private readonly priceLogService: PriceLogService,

    @InjectRepository(Item)
    private itemRepository: Repository<Item>
  ) {}

  async findOneByName(name: string): Promise<Item> {
    return await this.itemRepository.findOne({ where: { name: name } })
  }

  async findById(id: number): Promise<Item> {
    return await this.itemRepository.findOne(id)
  }

  async getAll(name?: string): Promise<Item[]> {
    const itemManager = getManager()
    if (name)
      return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.name LIKE '%${name}%'
        GROUP BY item.name
    `)
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        GROUP BY item.name
    `)
  }

  async getById(id: number): Promise<Item> {
    const itemManager = getManager()
    return await itemManager.query(`
        SELECT item.*, SUM(warehouse.amount) AS remaining
        FROM item
        LEFT JOIN warehouse
        ON item.id = warehouse.item_id AND expiration_date > DATE_ADD(DATE(NOW()), INTERVAL 1 MONTH)
        WHERE item.id = ${id}
        GROUP BY item.name
    `)
  }

  async create(transactionEntityManager: EntityManager, data: BodyCreateItem): Promise<any> {
    // Check item name exists
    const isItemExists = await this.findOneByName(data.name)
    if (isItemExists) throw new HttpException('The item already in use', HttpStatus.CONFLICT)

    // Create item
    await transactionEntityManager
      .insert(Item, data)
      .then(async (resolve) => {
        // Create item log
        await this.itemLogService.create(transactionEntityManager, {
          item: resolve.raw.insertId,
          name: data.name,
          category: data.category,
          detail: data.detail,
          user_manual: data.user_manual,
          created_by: data.user
        })
        // Create price log
        await this.priceLogService.create(transactionEntityManager, {
          item_id: resolve.raw.insertId,
          price: data.price,
          created_by: data.user
        })
      })
      .catch((reject) => {
        throw new HttpException('The item cannot create', HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }

  async update(transactionEntityManager: EntityManager, id: number, data: Partial<BodyUpdateItem>): Promise<any> {
    // Check item exists
    const isItemExists = await this.findOneByName(data.name)
    if (isItemExists) throw new HttpException('The item already in use', HttpStatus.CONFLICT)

    // Update item
    const item = await this.findById(id)
    if (!item) throw new HttpException('The item is not found', HttpStatus.NOT_FOUND)

    await transactionEntityManager
      .update(Item, id, data)
      .then(async (resolve) => {
        const _item = await transactionEntityManager.findOne(Item, id)

        // Create item log
        await this.itemLogService.create(transactionEntityManager, {
          item: _item.id,
          name: _item.name,
          category: <number>_item.category,
          detail: _item.detail,
          user_manual: _item.user_manual,
          created_by: data.user
        })

        // Create price log
        if (data.price)
          await this.priceLogService.create(transactionEntityManager, {
            item_id: id,
            price: _item.price,
            created_by: data.user
          })
      })
      .catch((reject) => {
        throw new HttpException('The item cannot update', HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }
}
