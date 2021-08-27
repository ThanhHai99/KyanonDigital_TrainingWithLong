import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/categories.controller';
import { CategoryLogController } from 'src/controllers/category_logs.controller';
import { Category } from 'src/entities/categories.entity';
import { CategoryLog } from 'src/entities/category_logs.entity';
import { CategoryService } from 'src/services/categories.service';
import { CategoryLogService } from 'src/services/category_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, CategoryLog])],
    controllers: [CategoryController, CategoryLogController],
    providers: [CategoryService, CategoryLogService]
})
export class CategoriesModule {}
