import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Sale } from './sale.entity';

@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>
    ) {}

    async isNameAndCodeAlreadyInUse(
        name: string,
        code: string
    ): Promise<boolean> {
        try {
            const sale = await this.saleRepository.findOneOrFail({
                where: [{ name: name }, { code: code }]
            });
            if (sale) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async getSaleStillApply(sale_code: string): Promise<Sale> {
        const _sale = await this.saleRepository.findOne({
            where: {
                end_date: Raw(
                    (alias) => `${alias} IS NULL OR ${alias} > NOW()`
                ),
                code: sale_code
            }
        });
        if (!_sale) return null;
        return _sale;
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

    async create(sale: Sale): Promise<Sale> {
        const tmp = await this.saleRepository.save(sale);
        return await this.getById(tmp.id);
    }

    async update(id: number, sale: Sale): Promise<Sale> {
        let _sale = await this.saleRepository.findOne({
            where: {
                id: id
            }
        });
        _sale.name = !!sale.name ? sale.name : _sale.name;
        _sale.start_date = !!sale.start_date
            ? sale.start_date
            : _sale.start_date;
        _sale.end_date = !!sale.end_date ? sale.end_date : _sale.end_date;
        _sale.discount = !!sale.discount ? sale.discount : _sale.discount;
        _sale.applied = !!sale.applied ? sale.applied : _sale.applied;
        _sale.code = !!sale.code ? sale.code : _sale.code;
        _sale.user = !!sale.user ? sale.user : _sale.user;
        await this.saleRepository.save(_sale);
        // return await this.saleRepository.findOne(id, {
        //     join: {
        //         alias: 'sale',
        //         leftJoinAndSelect: {
        //             role: 'sale.sale_item'
        //         }
        //     }
        // });

        // await this.saleRepository.save(sale);

        return await this.getById(sale.id);
    }
}
