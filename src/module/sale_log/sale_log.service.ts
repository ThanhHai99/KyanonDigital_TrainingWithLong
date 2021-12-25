import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { BodyCreateSaleLog } from './sale_log.dto'
import { SaleLog } from './sale_log.entity'

@Injectable()
export class SaleLogService {
  constructor(
    @InjectRepository(SaleLog)
    private saleLogRepository: Repository<SaleLog>
  ) {}

  async getAll(): Promise<SaleLog[]> {
    return await this.saleLogRepository.find()
  }

  async getById(id: number): Promise<SaleLog> {
    return await this.saleLogRepository.findOne(id)
  }

  async create(transactionEntityManager: EntityManager, data: BodyCreateSaleLog): Promise<any> {
    await transactionEntityManager.insert(SaleLog, data).catch((reject) => {
      throw new HttpException('The sale log cannot create', HttpStatus.BAD_REQUEST)
    })
  }
}
