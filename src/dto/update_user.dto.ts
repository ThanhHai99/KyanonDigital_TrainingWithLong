import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create_user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
