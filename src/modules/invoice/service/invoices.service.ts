import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/modules/invoice/entity/invoices.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>
    ) {}

    async getAll(): Promise<Invoice[]> {
        return await this.invoiceRepository.find();
    }

    async getById(id: number): Promise<Invoice> {
        return await this.invoiceRepository.findOne(id);
    }

    async create(category: Invoice): Promise<Invoice> {
        return await this.invoiceRepository.save(category);
    }
}
