import { Controller, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { ResponseGetInvoice } from '../dto/invoice.dto';
import { Invoice } from '../entity/invoice.entity';
import { InvoiceService } from '../service/invoice.service';

@ApiTags('invoice')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @ApiOkResponse({ description: 'Get all invoices' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetInvoice> {
        try {
            let invoices: Invoice[] = await this.invoiceService.getAll();
            if (!invoices || invoices.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetInvoice> {
        try {
            let invoice: Invoice = await this.invoiceService.getById(id);

            if (!invoice) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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
