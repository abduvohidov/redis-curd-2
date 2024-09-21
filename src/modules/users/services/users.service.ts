import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../models/user.entity';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { IRedisService } from '../../../common/services/redis/redis.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.RedisService) private redisService: IRedisService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}

	async verifyEmailAndSaveUser(code: number): Promise<UserModel | null> {
		const userFromRedis = await this.redisService.get(code.toString());
		if (userFromRedis) {
			return JSON.parse(userFromRedis);
		}
		return null;
	}
}
