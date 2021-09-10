import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './controller/invoice.controller';
import { Invoice } from './entity/invoice.entity';
import { InvoiceService } from './service/invoice.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invoice])],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [TypeOrmModule.forFeature([Invoice]), InvoiceService]
})
export class InvoiceModule {}
