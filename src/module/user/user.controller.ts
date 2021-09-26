import {
  Body,
  Controller,
  Get,
  Patch,
  Res,
  Query,
  Param,
  HttpStatus,
  Post
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

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: 'Get all users' })
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.userService.getAll(query)
    });
  }

  @ApiOkResponse({ description: 'Get user by id' })
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
  @Post()
  @ApiCreatedResponse({
    description: '0',
    type: User
  })
  async create(@Body() body: BodyCreateUser, @Res() res): Promise<any> {
    const { username, password, name, phone, address, is_locked, role_id } =
      body;
    await this.userService.createEmployee(
      username,
      password,
      name,
      phone,
      address,
      is_locked,
      role_id
    );
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
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateUser,
    @Res() res,
    @Param('id') id: number
  ): Promise<any> {
    const { password, name, phone, address, is_locked, role_id } =
      body;
    await this.userService.update(
      id,
      password,
      name,
      phone,
      address,
      is_locked,
      role_id
    );
    return res.status(HttpStatus.OK).json({
      error: 0,
      message: 'User is updated'
    });
  }
}
