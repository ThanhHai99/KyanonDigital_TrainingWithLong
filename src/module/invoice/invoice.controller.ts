import { Controller, Get, Res, Param, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGetInvoice } from './invoice.dto';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOkResponse({ description: 'Get all invoices' })
  @Get()
  async getAll(@Res() res): Promise<ResponseGetInvoice> {
    try {
      let invoices: Invoice[] = await this.invoiceService.getAll();
      if (!invoices || invoices.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: invoices
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiOkResponse({ description: "Get a invoice by invoice's id" })
  @Get(':id')
  async getById(
    @Res() res,
    @Param('id') id: number
  ): Promise<ResponseGetInvoice> {
    try {
      let invoice: Invoice = await this.invoiceService.getById(id);

      if (!invoice) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: invoice
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }
}