import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '@module/category/controller/category.controller';
import { Category } from '@module/category/entity/category.entity';
import { CategoryService } from '@module/category/service/category.service';
import { CategoryLogModule } from '@module/category_log/category_log.module';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), CategoryLogModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
