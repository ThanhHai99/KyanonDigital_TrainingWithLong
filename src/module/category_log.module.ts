import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryLogController } from '@controller/category_log.controller';
import { CategoryLog } from '@entity/category_log.entity';
import { CategoryLogService } from '@service/category_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryLog])],
    controllers: [CategoryLogController],
    providers: [CategoryLogService],
    exports: [CategoryLogService]
})
export class CategoryLogModule {}
