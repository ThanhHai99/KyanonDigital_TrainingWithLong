import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entity/item.entity';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}

    // async _findOne(id: number): Promise<Item> {
    //     return await this.itemRepository.findOne(id);
    // }

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
            SELECT item.*, warehouse.amount, category.name AS category_name
            FROM item
            LEFT JOIN warehouse
            ON item.id = warehouse.item_id AND warehouse.amount >= 10
            LEFT JOIN category
            ON item.category_id = category.id
            WHERE item.id = ${id}
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

    async create(category: Item): Promise<Item> {
        return await this.itemRepository.save(category);
    }

    async update(category: Item): Promise<Item> {
        await this.itemRepository.save(category);
        return await this.getById(category.id);
    }
}
