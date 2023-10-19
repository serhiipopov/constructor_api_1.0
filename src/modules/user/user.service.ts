import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from '../auth/dto/auth.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async getUserByEmail(dto: AuthDto) {
		try {
			const user = await this.prismaService.user.findUnique({
				where: { email: dto.email },
			});

			return user;
		} catch (error) {
			throw new NotFoundException('User already exists');
		}
	}

	async getUserByID(userId: number) {
		try {
			const user = await this.prismaService.user.findUnique({
				where: { id: userId },
			});

			return user;
		} catch (error) {
			throw new NotFoundException('User not found');
		}
	}
}
