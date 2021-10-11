import {
  Body,
  Controller,
  Get,
  Patch,
  Res,
  Query,
  Param,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { BodyCreateUser, BodyUpdateUser } from './user.dto';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import { RolesGuard } from '@module/role/guards/role.guard';
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: 'Get all users' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.userService.getAll(query)
    });
  }

  @ApiOkResponse({ description: 'Get user by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.userService.getById(id)
    });
  }

  @ApiCreatedResponse({
    type: BodyCreateUser,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateUser })
  @ApiCreatedResponse({
    description: '0',
    type: User
  })
  @Roles(Role.super_admin)
  @Post()
  async create(@Body() body: BodyCreateUser, @Res() res): Promise<any> {
    await this.userService.createEmployee(body);

    return res.status(HttpStatus.CREATED).json({
      error: 0,
      message: 'User is created'
    });
  }

  @ApiCreatedResponse({
    type: BodyUpdateUser,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyUpdateUser })
  @Roles(Role.super_admin)
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateUser,
    @Res() res,
    @Param('id') id: number
  ): Promise<any> {
    // const { password, name, phone, address, is_locked, role_id, is_active } =
    //   body;
    await this.userService.update(
      id,
      body
      // id,
      // password,
      // name,
      // phone,
      // address,
      // is_locked,
      // role_id,
      // is_active
    );
    return res.status(HttpStatus.OK).json({
      error: 0,
      message: 'User is updated'
    });
  }
}
