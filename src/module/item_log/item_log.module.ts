import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ItemLogController } from './item_log.controller'
import { ItemLog } from './item_log.entity'
import { ItemLogService } from './item_log.service'

@Module({
  imports: [TypeOrmModule.forFeature([ItemLog])],
  controllers: [ItemLogController],
  providers: [ItemLogService],
  exports: [ItemLogService, TypeOrmModule]
})
export class ItemLogModule {}
