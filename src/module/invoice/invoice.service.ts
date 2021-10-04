import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
    return await this.invoiceRepository.findOne(id);
  }

  async create(
    name: string,
    phone: string,
    cost: number,
    userId: number
  ): Promise<InsertResult> {
    const newInvoice = new Invoice();
    newInvoice.name = name;
    newInvoice.phone = phone;
    newInvoice.cost = cost;
    newInvoice.created_by = userId;
    const result = await this.invoiceRepository.insert(newInvoice);
    if (!result)
      throw new HttpException(
        'The invoice cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
