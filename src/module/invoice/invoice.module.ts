import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from '@module/invoice/controller/invoice.controller';
import { Invoice } from '@module/invoice/entity/invoice.entity';
import { InvoiceService } from '@module/invoice/service/invoice.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [TypeOrmModule.forFeature([Invoice]), InvoiceService]
})
export class InvoiceModule {}
