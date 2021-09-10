import { Test, TestingModule } from '@nestjs/testing';
import { SaleItemService } from './sale_item.service';

describe('SaleItemService', () => {
    let service: SaleItemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SaleItemService]
        }).compile();

        service = module.get<SaleItemService>(SaleItemService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
