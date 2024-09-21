import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { PrismaClient } from '@prisma/client';
import {
	CityController,
	CityRepository,
	CitysService,
	ICityController,
	ICityRepository,
	ICityService,
} from './modules/cities';
import {
	CountriesController,
	CountriesRepository,
	CountriessService,
	ICountriesController,
	ICountriesRepository,
	ICountriesService,
} from './modules/countries';
import {
	IUserController,
	IUserService,
	IUsersRepository,
	UserController,
	UserService,
	UsersRepository,
} from './modules/users';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './common/services/redis/redis.service';
import { IRedisService } from './common/services/redis/redis.service.interface';
import { IEmailService } from './common/services/email/email.service.interface';
import { EmailService } from './common/services/email/email.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
	bind<IRedisService>(TYPES.RedisService).to(RedisService);
	bind<IEmailService>(TYPES.EmailService).to(EmailService);

	bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService);

	bind<ICityRepository>(TYPES.CityRepository).to(CityRepository).inSingletonScope();
	bind<ICityController>(TYPES.CityController).to(CityController).inSingletonScope();
	bind<ICityService>(TYPES.CityService).to(CitysService);

	bind<ICountriesRepository>(TYPES.CountriesRepository).to(CountriesRepository).inSingletonScope();
	bind<ICountriesController>(TYPES.CountriesController).to(CountriesController).inSingletonScope();
	bind<ICountriesService>(TYPES.CountriesService).to(CountriessService);

	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
