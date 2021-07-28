import { PartialType } from "@nestjs/swagger";
import { CreateSaleDto } from "./create_sale.dto";

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
