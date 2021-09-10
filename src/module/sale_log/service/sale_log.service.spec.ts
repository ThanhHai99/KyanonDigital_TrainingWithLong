import { Test, TestingModule } from '@nestjs/testing';
import { SaleLogService } from './sale_log.service';

describe('SaleLogService', () => {
    let service: SaleLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SaleLogService]
        }).compile();

        service = module.get<SaleLogService>(SaleLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
