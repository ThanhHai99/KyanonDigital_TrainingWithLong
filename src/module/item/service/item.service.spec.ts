import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from '@module/item/service/item.service';

describe('ItemService', () => {
    let service: ItemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ItemService]
        }).compile();

        service = module.get<ItemService>(ItemService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
