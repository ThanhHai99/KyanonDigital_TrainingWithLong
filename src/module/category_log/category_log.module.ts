import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryLogController } from './category_log.controller';
import { CategoryLog } from './category_log.entity';
import { CategoryLogService } from '@module/category_log/category_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryLog])],
    controllers: [CategoryLogController],
    providers: [CategoryLogService],
    exports: [CategoryLogService]
})
export class CategoryLogModule {}
