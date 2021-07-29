import { Injectable } from '@nestjs/common';
import { Warehouse } from 'src/entities/warehouses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private warehouseRepository: Repository<Warehouse>
    ) {}

    getAll(): Promise<Warehouse[]> {
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
}
