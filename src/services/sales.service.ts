import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sales.entity';

@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>
    ) {}

    async _findOne(id: number): Promise<Sale> {
        return await this.saleRepository.findOne(id);
    }

    async isNameAlreadyInUse(name: string): Promise<boolean> {
        try {
            const sale = await this.saleRepository.findOneOrFail({
                where: {
                    name: name
                }
            });
            if (sale) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async getAll(): Promise<Sale[]> {
        return this.saleRepository.find({
            join: {
                alias: 'sales',
                leftJoinAndSelect: {
                    sale_item: 'sales.sale_item'
                }
            }
        });
    }

    async getById(id: number): Promise<Sale> {
        return this.saleRepository.findOne(id, {
            join: {
                alias: 'sales',
                leftJoinAndSelect: {
                    sale_item: 'sales.sale_item'
                }
            }
        });
    }

    async create(sale: Sale): Promise<Sale> {
        return await this.saleRepository.save(sale);
    }

    async update(sale: Sale): Promise<Sale> {
        await this.saleRepository.save(sale);
        return await this._findOne(sale.id);
    }
}
