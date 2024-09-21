import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../../../common/base.controller';
import { HTTPError } from '../../../errors/http-error.class';
import { ILogger } from '../../../logger/logger.interface';
import { TYPES } from '../../../types';
import { ICountriesService } from '../services/country.service.interface';
import { ICountriesController } from './country.controller.interface';
import { CountriesCreateDto } from '../dto/country-create.dto';
import { ICountriesEntity } from '../models/country.entity.interface';
import { CountriesUpdateDto } from '../dto/country-update.dto';
import 'reflect-metadata';

@injectable()
export class CountriesController extends BaseController implements ICountriesController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CountriesService) private CountriesService: ICountriesService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.create,
			},
			{
				path: '/all',
				method: 'get',
				func: this.findAll,
			},
			{
				path: '/id/:id',
				method: 'get',
				func: this.findById,
			},
			{
				path: '/name/:name',
				method: 'get',
				func: this.findByName,
			},
			{
				path: '/update/:id',
				method: 'patch',
				func: this.update,
			},
			{
				path: '/remove/:id',
				method: 'delete',
				func: this.remove,
			},
		]);
	}

	async create(
		{ body }: Request<{}, {}, CountriesCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.CountriesService.createCountries(body);
		if (!data) {
			return next(new HTTPError(422, 'Такой Countries уже существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Countries успешно создано',
			data,
		});
	}

	async findAll(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<ICountriesEntity[] | void> {
		const data = await this.CountriesService.find();
		if (!data) {
			return next(new HTTPError(422, 'Такой Countries уже существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Countries успешно получено',
			data,
		});
	}

	async findById(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<ICountriesEntity | void> {
		const { id } = req.params;
		const data = await this.CountriesService.findById(Number(id));
		if (!data) {
			return next(new HTTPError(422, 'Такой Countries уже существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Countries успешно получено',
			data,
		});
	}

	async findByName(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<ICountriesEntity | void> {
		const { name } = req.body;
		const data = await this.CountriesService.findByName(name);
		if (!data) {
			return next(new HTTPError(422, 'Такой Countries не существует'));
		}
		this.ok(res, {
			status: true,
			message: 'Countries успешно получено',
			data,
		});
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<ICountriesEntity | void> {
		const { id } = req.params;
		const params: CountriesUpdateDto = req.body;
		const data = await this.CountriesService.update(Number(id), params);
		if (!data) {
			return next(new HTTPError(422, 'Такой Countries не существует'));
		}

		this.ok(res, { status: true, message: 'Countries успешно изменено', data });
	}

	async remove(req: Request, res: Response, next: NextFunction): Promise<ICountriesEntity | void> {
		const { id } = req.params;
		const result = await this.CountriesService.remove(Number(id));
		if (!result) {
			return next(new HTTPError(422, 'Нет такой Countries'));
		}
		this.ok(res, {
			status: true,
			message: 'Countries успешно удалено',
		});
	}
}
