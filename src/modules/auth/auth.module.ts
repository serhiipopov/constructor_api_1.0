import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { getJwtConfig } from '../../config/jwt.config';

import { JwtStrategy } from './auth.strategy';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService, UserService],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
})
export class AuthModule {}
