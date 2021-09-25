import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryLogModule } from '@module/category_log/category_log.module';
import { UserModule } from '@module/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CategoryLogModule,
    UserModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
