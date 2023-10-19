import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './modules/database/prisma.service';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
