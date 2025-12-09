import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'refId must be a string' })
  @MaxLength(100, { message: 'refId must not exceed 100 characters' })
  refId: string;

  @IsString({ message: 'name must be a string' })
  @MaxLength(100, { message: 'name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'icon must be a string' })
  @MaxLength(200, { message: 'icon must not exceed 200 characters' })
  icon?: string;
}

