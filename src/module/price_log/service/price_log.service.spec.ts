import { Test, TestingModule } from '@nestjs/testing';
import { PriceLogService } from '@module/price_log/service/price_log.service';

describe('PriceLogService', () => {
    let service: PriceLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PriceLogService]
        }).compile();

        service = module.get<PriceLogService>(PriceLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
