import { Test, TestingModule } from '@nestjs/testing';
import { ItemLogService } from './item_logs.service';

describe('ItemLogService', () => {
    let service: ItemLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ItemLogService]
        }).compile();

        service = module.get<ItemLogService>(ItemLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
