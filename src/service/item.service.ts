import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '@entity/item.entity';
import { getConnection, getManager, Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}

    async findOneAndSelectPrice(id: number): Promise<Item> {
        return await this.itemRepository.findOne({
            select: ["price"],
            where: {
                id: id
            }
        });
    };

    async findById(id: number): Promise<Item> {
        return await getConnection()
            .createQueryBuilder()
            .from(Item, 'item')
            .leftJoinAndSelect('item.category', 'category')
            .where('item.id = :id', { id: id })
            .getOne();
    }

    async getAll(): Promise<Item[]> {
        const itemManager = getManager();
        return await itemManager.query(`
            SELECT item.*, warehouse.amount, category.name AS category_name
            FROM item
            LEFT JOIN warehouse
            ON item.id = warehouse.item_id AND warehouse.amount >= 10
            LEFT JOIN category
            ON item.category_id = category.id
        `);
    }

    async getByName(name: string): Promise<Item[]> {
        const itemManager = getManager();
        return await itemManager.query(`
            SELECT item.*, warehouse.amount, category.name AS category_name
            FROM item
            LEFT JOIN warehouse
            ON item.id = warehouse.item_id AND warehouse.amount >= 10
            LEFT JOIN category
            ON item.category_id = category.id
            WHERE item.name LIKE '%${name}%'
        `);
    }

    async getById(id: number): Promise<Item> {
        const itemManager = getManager();
        return await itemManager.query(`
            SELECT item.*, warehouse.amount, category.name AS category_name, category.id AS category_id
            FROM item
            LEFT JOIN warehouse
            ON item.id = warehouse.item_id AND warehouse.amount >= 10
            LEFT JOIN category
            ON item.category_id = category.id
            WHERE item.id = '${id}'
        `);
    }

    async isNameAlreadyInUse(name: string): Promise<boolean> {
        try {
            const user = await this.itemRepository.findOneOrFail({
                where: {
                    name: name
                }
            });
            if (user) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async create(item: Item): Promise<Item> {
        return await this.itemRepository.save(item);
    }

    async update(id: number, item: Item): Promise<Item> {
        let _item = await this.itemRepository.findOne(id);
        _item.name = !!item.name ? item.name : _item.name;
        _item.detail = !!item.detail ? item.detail : _item.detail;
        _item.user_manual = !!item.user_manual
            ? item.user_manual
            : _item.user_manual;
        _item.price = !!item.price ? item.price : _item.price;
        await this.itemRepository.save(_item);
        return await this.itemRepository.findOne(id, {
            join: {
                alias: 'item',
                leftJoinAndSelect: {
                    role: 'item.category'
                }
            }
        });
    }
}
