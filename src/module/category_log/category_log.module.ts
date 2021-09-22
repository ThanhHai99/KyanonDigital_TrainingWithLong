import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryLogController } from '@module/category_log/controller/category_log.controller';
import { CategoryLog } from '@module/category_log/entity/category_log.entity';
import { CategoryLogService } from '@module/category_log/service/category_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryLog])],
    controllers: [CategoryLogController],
    providers: [CategoryLogService],
    exports: [
        TypeOrmModule.forFeature([CategoryLog]),
        CategoryLogService
    ]
})
export class CategoryLogModule {}
