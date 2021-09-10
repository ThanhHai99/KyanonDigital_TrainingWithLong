import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entity/item.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}

    async _findOne(id: number): Promise<Item> {
        return await this.itemRepository.findOne(id);
    }

    async getAll(): Promise<Item[]> {
        return await this.itemRepository.find({
            join: {
                alias: 'item',
                leftJoinAndSelect: {
                    role: 'item.category'
                }
            }
        });
    }

    async getByName(name: string): Promise<Item[]> {
        return await this.itemRepository.find({
            where: {
                name: Like('%' + name + '%')
            },
            join: {
                alias: 'item',
                leftJoinAndSelect: {
                    role: 'item.category'
                }
            }
        });
    }

    async getById(id: number): Promise<Item> {
        return await this.itemRepository.findOne(id, {
            join: {
                alias: 'item',
                leftJoinAndSelect: {
                    role: 'item.category'
                }
            }
        });
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
