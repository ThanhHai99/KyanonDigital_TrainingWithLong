import { Controller, Get, Res, Param, Post, Body, Patch, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { getConnection } from 'typeorm';
import { SaleItem } from '@module/sale_item/sale_item.entity';
import { SaleItemService } from '@module/sale_item/sale_item.service';
import { SaleLog } from '@module/sale_log/sale_log.entity';
import { SaleLogService } from '@module/sale_log/sale_log.service';
import {
  BodyCreateSale,
  BodyUpdateSale,
  ResponseCreateSale,
  ResponseGetSale,
  ResponseUpdateSale
} from './sale.dto';
import { Sale } from './sale.entity';
import { SaleService } from './sale.service';

@ApiTags('sale')
@Controller('sale')
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly saleLogService: SaleLogService,
    private readonly saleItemService: SaleItemService
  ) {}

  @ApiOkResponse({ description: 'Get all sales' })
  @Get()
  async getAll(@Res() res): Promise<ResponseGetSale> {
    try {
      const sales: Sale[] = await this.saleService.getAll();
      if (!sales || sales.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: sales
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiOkResponse({ description: "Get a sale by sale's id" })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<ResponseGetSale> {
    try {
      const sale: Sale = await this.saleService.getById(id);
      if (!sale) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: sale
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiCreatedResponse({
    type: BodyCreateSale,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateSale })
  @Post()
  async create(
    @Body() body: BodyCreateSale,
    @Res() res
  ): Promise<ResponseCreateSale> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();

    try {
      let newSale = new Sale();
      newSale.name = body.name;
      newSale.start_date = body.start_date;
      newSale.end_date = body.end_date;
      newSale.discount = body.discount;
      newSale.applied = !!body.applied ? body.applied : false;
      newSale.code = body.code;
      newSale.user = res.locals.jwtPayload.userId; // Get from token

      const isNameExisting: boolean =
        await this.saleService.isNameAndCodeAlreadyInUse(body.name, body.code);

      if (isNameExisting) {
        return res.status(409).json({
          error: 1,
          data: 'Name or code already exists'
        });
      }

      if (body.item_id.length !== body.amount.length) {
        return res.status(409).json({
          error: 1,
          data: 'Item or amount of item invalid'
        });
      }

      const sale: Sale = await this.saleService.create(newSale);
      // Create sale item
      const itemArray: Array<number> = body.item_id;
      const amountArray: Array<number> = body.amount;

      for (const i in itemArray) {
        if (Object.prototype.hasOwnProperty.call(itemArray, i)) {
          let newSaleItem = new SaleItem();
          newSaleItem.item_id = itemArray[i];
          newSaleItem.sale = <any>sale.id;
          newSaleItem.amount = amountArray[i];
          await this.saleItemService.create(newSaleItem);
        }
      }

      // Create sale log
      let newSaleLog = new SaleLog();
      newSaleLog.name = sale.name;
      newSaleLog.sale = <any>sale.id;
      newSaleLog.sale_item = body.item_id.toString();
      newSaleLog.start_date = sale.start_date;
      newSaleLog.end_date = sale.end_date;
      newSaleLog.amount = body.amount.toString();
      newSaleLog.discount = sale.discount;
      newSaleLog.applied = sale.applied;
      newSaleLog.code = sale.code;
      newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
      await this.saleLogService.create(newSaleLog);

      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(201).json({
        error: 0,
        data: sale
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiCreatedResponse({
    type: BodyUpdateSale,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyUpdateSale })
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateSale,
    @Res() res,
    @Param('id') id: number
  ): Promise<ResponseUpdateSale> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();
    try {
      const _sale: Sale = await this.saleService.getById(id);
      if (!_sale) {
        return res.status(404).json({
          error: 1,
          message: 'Sale is not found'
        });
      }

      if (_sale.applied) {
        return res.status(400).json({
          error: 0,
          message: 'This sale was applied'
        });
      }

      const isNameExisting: boolean =
        await this.saleService.isNameAndCodeAlreadyInUse(body.name, body.code);

      if (isNameExisting) {
        return res.status(409).json({
          error: 1,
          message: 'Name already exists'
        });
      }

      _sale.name = !!body.name ? body.name : _sale.name;
      _sale.start_date = !!body.start_date ? body.start_date : _sale.start_date;
      _sale.end_date = !!body.end_date ? body.end_date : _sale.end_date;
      _sale.discount = !!body.discount ? body.discount : _sale.discount;
      _sale.applied = !!body.applied ? body.applied : _sale.applied;
      _sale.code = !!body.code ? body.code : _sale.code;
      _sale.user = res.locals.jwtPayload.userId; // Get from token

      const sale: Sale = await this.saleService.update(id, _sale);
      const t: SaleItem[] = await this.saleItemService.getBySaleId(_sale.id);

      const sale_item: string = t.map((e) => e.item_id).toString();
      const sale_amount: string = t.map((e) => e.amount).toString();

      // // Update sale item
      // if (
      //     !!body.item_id &&
      //     !!body.amount &&
      //     body.item_id.length !== body.amount.length
      // ) {
      //     return res.status(409).json({
      //         error: 1,
      //         data: 'Item or amount of item invalid'
      //     });
      // }

      // const itemArray: Array<number> = body.item_id;
      // const amountArray: Array<number> = body.amount;

      // for (const i in itemArray) {
      //     if (Object.prototype.hasOwnProperty.call(itemArray, i)) {
      //         let _saleItem =
      //             await this.saleItemService.findByItemIdAndAmount(
      //                 itemArray[i],
      //                 amountArray[i]
      //             );
      //         // let newSaleItem = new SaleItem();
      //         // newSaleItem.item_id = itemArray[i];
      //         // newSaleItem.sale = <any>sale.id;
      //         // newSaleItem.amount = amountArray[i];
      //         await this.saleItemService.update(
      //             _saleItem.id,
      //             itemArray[i],
      //             amountArray[i]
      //         );
      //     }
      // }

      // Create sale log
      let newSaleLog: SaleLog = new SaleLog();
      newSaleLog.name = sale.name;
      newSaleLog.sale = <any>sale.id;
      newSaleLog.sale_item = sale_item;
      newSaleLog.start_date = sale.start_date;
      newSaleLog.end_date = sale.end_date;
      newSaleLog.amount = sale_amount;
      newSaleLog.discount = sale.discount;
      newSaleLog.code = sale.code;
      newSaleLog.applied = sale.applied;
      newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
      await this.saleLogService.create(newSaleLog);

      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(HttpStatus.OK).json({
        error: 0,
        data: sale
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
  }
}