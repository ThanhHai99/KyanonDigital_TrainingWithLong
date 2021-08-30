import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseLogService } from './warehouse_logs.service';

describe('WarehouseLogService', () => {
    let service: WarehouseLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WarehouseLogService]
        }).compile();

        service = module.get<WarehouseLogService>(WarehouseLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
