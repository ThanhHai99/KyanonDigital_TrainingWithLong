import { Test, TestingModule } from '@nestjs/testing';
import { CategoryLogService } from '@module/category_log/service/category_log.service';

describe('CategoryLogService', () => {
    let service: CategoryLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryLogService]
        }).compile();

        service = module.get<CategoryLogService>(CategoryLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
