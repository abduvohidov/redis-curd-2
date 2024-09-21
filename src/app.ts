import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { PrismaClient } from '@prisma/client';
import { CountriesController, ICountriesRepository } from './modules/countries';
import { IUsersRepository, UserController } from './modules/users';
import { PrismaService } from './database/prisma.service';
import 'reflect-metadata';
import { CityController, ICityRepository } from './modules/cities';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number | string;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaClient) private prismaClient: PrismaClient,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
		@inject(TYPES.CityController) private CityController: CityController,
		@inject(TYPES.CityRepository) private CityRepository: ICityRepository,
		@inject(TYPES.CountriesController) private CountriesController: CountriesController,
		@inject(TYPES.CountriesRepository) private CountriesRepository: ICountriesRepository,
	) {
		this.app = express();
		this.port = this.configService.get('PORT') || 9000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/cities', this.CityController.router);
		this.app.use('/countries', this.CountriesController.router);
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
