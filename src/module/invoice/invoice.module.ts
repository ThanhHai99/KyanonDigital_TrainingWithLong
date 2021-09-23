import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './invoice.entity';
import { InvoiceService } from '@module/invoice/invoice.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [TypeOrmModule.forFeature([Invoice]), InvoiceService]
})
export class InvoiceModule {}
