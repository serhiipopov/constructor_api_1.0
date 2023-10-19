import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private prismaService: PrismaService,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate({ id }: Pick<User, 'id'>) {
		return this.prismaService.user.findUnique({ where: { id: id } });
	}
}
