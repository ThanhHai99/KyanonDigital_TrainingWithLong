import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

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
    return await this.invoiceRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
