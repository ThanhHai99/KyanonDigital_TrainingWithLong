import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from '@module/category/category.service';
import { CategoryLogModule } from '@module/category_log/category_log.module';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), CategoryLogModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
