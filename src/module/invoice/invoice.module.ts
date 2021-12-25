import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvoiceController } from './invoice.controller'
import { Invoice } from './invoice.entity'
import { InvoiceService } from './invoice.service'

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [TypeOrmModule, InvoiceService]
})
export class InvoiceModule {}
