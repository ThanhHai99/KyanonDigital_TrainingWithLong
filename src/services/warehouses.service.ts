import { Injectable } from '@nestjs/common';
import { Warehouse } from 'src/entities/warehouses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private warehouseRepository: Repository<Warehouse>
    ) {}

    readAll(): Promise<Warehouse[]> {
        return this.warehouseRepository.find({
            select: [
                'id',
                'expiration_date',
                'amount',
                'created_at',
                'updated_at'
            ],
            join: {
                alias: 'warehouses',
                leftJoinAndSelect: {
                    item: 'warehouses.item'
                }
            }
        });
    }

    readOne(id: EntityId): Promise<Warehouse> {
        return this.warehouseRepository.findOne({
            select: [
                'id',
                'expiration_date',
                'amount',
                'created_at',
                'updated_at'
            ],
            where: {
                id: id
            },
            join: {
                alias: 'warehouses',
                leftJoinAndSelect: {
                    item: 'warehouses.item'
                }
            }
        });
    }
}
