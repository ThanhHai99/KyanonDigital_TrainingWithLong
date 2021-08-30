import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/modules/category/controller/categories.controller';
import { CategoryLogController } from 'src/modules/category_log/controller/category_logs.controller';
import { Category } from 'src/modules/category/entity/categories.entity';
import { CategoryLog } from 'src/modules/category_log/entity/category_logs.entity';
import { CategoryService } from 'src/modules/category/service/categories.service';
import { CategoryLogService } from 'src/modules/category_log/service/category_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, CategoryLog])],
    controllers: [CategoryController, CategoryLogController],
    providers: [CategoryService, CategoryLogService]
})
export class CategoriesModule {}
