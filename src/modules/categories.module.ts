import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/categories.controller';
import { CategoryLogController } from 'src/controllers/category_logs.controller';
import { Category } from 'src/entities/categories.entity';
import { Category_Log } from 'src/entities/category_logs.entity';
import { CategoryService } from 'src/services/categories.service';
import { CategoryLogService } from 'src/services/category_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Category_Log])],
    controllers: [CategoryController, CategoryLogController],
    providers: [CategoryService, CategoryLogService]
})
export class CategoriesModule {}
