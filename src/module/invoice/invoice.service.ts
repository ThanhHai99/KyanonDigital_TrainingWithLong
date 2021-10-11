import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BodyCreateInvoice } from './invoice.dto';
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
    transactionEntityManager: EntityManager,
    data: BodyCreateInvoice
  ): Promise<any> {
    await transactionEntityManager.save(data).catch((reject) => {
      throw new HttpException(
        'The invoice cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
