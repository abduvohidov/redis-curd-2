import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger/logger.interface';
import { IUserService } from '../services/users.service.interface';
import { IConfigService } from '../../../config/config.service.interface';
import { BaseController } from '../../../common/baseController/base.controller';
import { ValidateMiddleware } from '../../../common/middlewares/validate.middleware';
import { HTTPError } from '../../../errors/http-error.class';
import { AuthGuard } from '../../../common/middlewares/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/verifyEmail',
				method: 'post',
				func: this.verifyEmailAndSave,
			},
			{
				path: '/remove/:id',
				method: 'delete',
				func: this.remove,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		const result = await this.userService.remove(Number(id));
		if (!result) {
			return next(new HTTPError(422, 'Нет такой пользователь'));
		}
		this.ok(res, {
			status: true,
			message: 'пользователь успешно удалено',
		});
	}

	async verifyEmailAndSave(
		{ body }: Request<{}, {}, { code: number }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.verifyEmailAndSaveUser(body.code);

		if (!user) {
			this.send(res, 422, 'Code is invalid');
			return;
		}
		const token = await this.signJWT(user.email, this.configService.get('SECRET'));
		res.cookie('token', token);
		this.ok(res, { user, token });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
