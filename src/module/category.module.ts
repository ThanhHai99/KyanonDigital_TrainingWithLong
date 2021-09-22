import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '@controller/category.controller';
import { Category } from '@entity/category.entity';
import { CategoryService } from '@service/category.service';
import { CategoryLogModule } from '@module/category_log.module';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), CategoryLogModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
