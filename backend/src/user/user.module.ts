/**
 * User Module
 * Provides user management services and endpoints
 * Registers User schema with Mongoose
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService for use in other modules (e.g., AuthModule)
})
export class UserModule {}
