import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from 'src/modules/invoice/controller/invoices.controller';
import { Invoice } from 'src/modules/invoice/entity/invoices.entity';
import { InvoiceService } from 'src/modules/invoice/service/invoices.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService]
})
export class InvoiceModule {}
