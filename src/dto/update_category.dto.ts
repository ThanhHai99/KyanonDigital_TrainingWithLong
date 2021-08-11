import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create_category.dto";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
