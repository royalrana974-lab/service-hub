import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const exists = await this.serviceModel.exists({ refId: dto.refId });
    if (exists) {
      throw new ConflictException('Service with this refId already exists');
    }
    const service = new this.serviceModel(dto);
    return service.save();
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find().sort({ name: 1 }).lean().exec();
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).lean().exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByRefId(refId: string): Promise<Service> {
    const service = await this.serviceModel.findOne({ refId }).lean().exec();
    if (!service) {
      throw new NotFoundException(`Service with refId '${refId}' not found`);
    }
    return service;
  }

  async seedDefaults(): Promise<{ inserted: number; skipped: number }> {
    const defaults: CreateServiceDto[] = [
      { refId: 'cleaning', name: 'Cleaning', icon: 'cleaning' },
      { refId: 'plumbing', name: 'Plumbing', icon: 'plumbing' },
      { refId: 'electrical', name: 'Electrical', icon: 'electrical' },
      { refId: 'salon-spa', name: 'Salon & Spa', icon: 'salon-spa' },
      { refId: 'carpentry', name: 'Carpentry', icon: 'carpentry' },
      { refId: 'painting', name: 'Painting', icon: 'painting' },
      { refId: 'appliances', name: 'Appliances', icon: 'appliances' },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const item of defaults) {
      const exists = await this.serviceModel.exists({ refId: item.refId });
      if (exists) {
        skipped += 1;
        continue;
      }
      await this.serviceModel.create(item);
      inserted += 1;
    }

    return { inserted, skipped };
  }
}

