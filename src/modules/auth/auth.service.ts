import { JwtService } from '@nestjs/jwt';
import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	async register(dto: AuthDto) {
		await this.userService.getUserByEmail(dto);

		const user = await this.prismaService.user.create({
			data: {
				email: dto.email,
				name: faker.name.firstName(),
				password: await hash(dto.password),
				updatedAt: faker.date.recent(),
				createdAt: faker.date.past(),
			},
		});

		return this.generateUserFields(user);
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken);
		if (!result) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const user = await this.userService.getUserByID(result.id);

		return this.generateUserFields(user);
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);

		return this.generateUserFields(user);
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getUserByEmail(dto);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isValid = await verify(user.password, dto.password);
		if (!isValid) {
			throw new UnauthorizedException('Wrong email or password');
		}

		return user;
	}

	private async issueTokens(userId: number) {
		const data = { id: userId };

		const accessToken = this.jwtService.sign(data, { expiresIn: '1h' });
		const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}

	private async generateUserFields(user: User) {
		const tokens = await this.issueTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens,
		};
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
		};
	}
}
