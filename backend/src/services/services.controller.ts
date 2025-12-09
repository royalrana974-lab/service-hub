import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get('ref/:refId')
  @HttpCode(HttpStatus.OK)
  async findByRefId(@Param('refId') refId: string) {
    return this.servicesService.findByRefId(refId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seedDefaults() {
    return this.servicesService.seedDefaults();
  }
}

