import { Injectable } from '@nestjs/common';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from '@entity/warehouse.entity';
const moment = require('moment');

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private warehouseRepository: Repository<Warehouse>
    ) {}

    async getAll(): Promise<Warehouse[]> {
        return await this.warehouseRepository.find({
            join: {
                alias: 'warehouse',
                leftJoinAndSelect: {
                    item: 'warehouse.item'
                }
            }
        });
    }

    async getById(id: number): Promise<Warehouse> {
        return await this.warehouseRepository.findOne(id, {
            join: {
                alias: 'warehouse',
                leftJoinAndSelect: {
                    item: 'warehouse.item'
                }
            }
        });
    }

    async create(warehouse: Warehouse): Promise<Warehouse> {
        return await this.warehouseRepository.save(warehouse);
    }

    async getInventory(condition: Date): Promise<Warehouse[]> {
        return await this.warehouseRepository.find({
            expiration_date: Raw((alias) => `${alias} < '${condition}'`)
        });
    }

    async isEnoughItemToExport(
        condition: Date,
        item: number,
        amount: number
    ): Promise<boolean> {
        // for (const i in item) {
        // if (Object.prototype.hasOwnProperty.call(item, i)) {
        // const e = item[i];
        const { sumAmount } = await this.warehouseRepository
            .createQueryBuilder('warehouse')
            .select('SUM(amount)', 'sumAmount')
            .where('item_id = :item', { item })
            .andWhere('expiration_date > :condition', { condition })
            .getRawOne();
        if (sumAmount < amount) return false;
        // }
        // }
        return true;
    }

    async exportItemByAmount(
        condition: Date,
        itemData: Array<number>,
        amountData: Array<number>
    ): Promise<Array<string>> {
        let response = [];
        for (const i in itemData) {
            let response_i = '';
            if (Object.prototype.hasOwnProperty.call(itemData, i)) {
                let _item = itemData[i];
                let _amount = amountData[i];
                while (_amount > 0) {
                    const rs: any = await this.warehouseRepository
                        .createQueryBuilder('warehouse')
                        .where('item_id = :_item', { _item })
                        .andWhere('expiration_date > :condition', { condition })
                        .andWhere('amount > 0')
                        .orderBy('expiration_date', 'ASC')
                        .getRawOne();

                    const {
                        warehouse_id,
                        warehouse_amount,
                        warehouse_expiration_date
                    } = rs;

                    if (warehouse_amount <= _amount) {
                        await this.warehouseRepository.update(warehouse_id, {
                            amount: 0
                        });
                        response_i =
                            warehouse_id +
                            ';' +
                            _item +
                            ';' +
                            warehouse_amount +
                            ';' +
                            moment(new Date(warehouse_expiration_date)).format(
                                'YYYY-MM-DD'
                            );
                    } else {
                        await this.warehouseRepository.update(warehouse_id, {
                            amount: warehouse_amount - _amount
                        });
                        response_i =
                            warehouse_id +
                            ';' +
                            _item +
                            ';' +
                            _amount +
                            ';' +
                            moment(new Date(warehouse_expiration_date)).format(
                                'YYYY-MM-DD'
                            );
                    }

                    _amount -= warehouse_amount;
                    response.push(response_i);
                }
            }
        }
        return response;
    }
}
