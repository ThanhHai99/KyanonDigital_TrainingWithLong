import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import {
  Controller,
  Get,
  Res,
  Param,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';

@ApiTags('invoice')
@Controller('invoice')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOkResponse({ description: 'Get all invoices' })
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.invoiceService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a invoice by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.invoiceService.getById(id)
    });
  }
}
