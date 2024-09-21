import { UserModel } from '@prisma/client';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserLoginDto } from '../dto/user-login.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<Omit<UserModel, 'id'> | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	remove: (id: number) => Promise<UserModel | null>;
	verifyEmailAndSaveUser: (code: number) => Promise<UserModel | null>;
}
