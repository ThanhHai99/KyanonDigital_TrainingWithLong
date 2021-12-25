import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryLogController } from './category_log.controller'
import { CategoryLog } from './category_log.entity'
import { CategoryLogService } from './category_log.service'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryLog])],
  controllers: [CategoryLogController],
  providers: [CategoryLogService],
  exports: [CategoryLogService, TypeOrmModule]
})
export class CategoryLogModule {}
