import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';

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
		let user;
		try {
			user = await this.prismaService.user.findUnique({
				where: { id: userId },
			});
		} catch (error) {
			throw new InternalServerErrorException(error);
		}

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}
}
