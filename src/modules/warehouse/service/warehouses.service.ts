import { Injectable } from '@nestjs/common';
import { Warehouse } from 'src/modules/warehouse/entity/warehouses.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
                alias: 'warehouses',
                leftJoinAndSelect: {
                    item: 'warehouses.item'
                }
            }
        });
    }

    async getById(id: number): Promise<Warehouse> {
        return await this.warehouseRepository.findOne(id, {
            join: {
                alias: 'warehouses',
                leftJoinAndSelect: {
                    item: 'warehouses.item'
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
                    .createQueryBuilder('warehouses')
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
                    const rs = await this.warehouseRepository
                        .createQueryBuilder('warehouses')
                        .where('item_id = :_item', { _item })
                        .andWhere('expiration_date > :condition', { condition })
                        .andWhere('amount > 0')
                        .orderBy('expiration_date', 'ASC')
                        .getRawOne();

                    const {
                        warehouses_id,
                        warehouses_amount,
                        warehouses_expiration_date
                    } = rs;

                    if (warehouses_amount <= _amount) {
                        await this.warehouseRepository.update(warehouses_id, {
                            amount: 0
                        });
                        response_i =
                            warehouses_id +
                            ';' +
                            _item +
                            ';' +
                            warehouses_amount +
                            ';' +
                            moment(new Date(warehouses_expiration_date)).format(
                                'YYYY-MM-DD'
                            );
                    } else {
                        await this.warehouseRepository.update(warehouses_id, {
                            amount: warehouses_amount - _amount
                        });
                        response_i =
                            warehouses_id +
                            ';' +
                            _item +
                            ';' +
                            _amount +
                            ';' +
                            moment(new Date(warehouses_expiration_date)).format(
                                'YYYY-MM-DD'
                            );
                    }

                    _amount -= warehouses_amount;
                    response.push(response_i);
                }
            }
        }
        return response;
    }
}
