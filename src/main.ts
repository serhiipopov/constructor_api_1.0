import { NestFactory } from '@nestjs/core';
import { PrismaService } from './database/prisma.service';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// app.get(PrismaService, { strict: false });

	app.useGlobalPipes(new ValidationPipe());

	app.setGlobalPrefix('api');
	app.enableCors();
	await app.listen(4200);
}

bootstrap();
