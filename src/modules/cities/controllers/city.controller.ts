import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../../../common/base.controller';
import { HTTPError } from '../../../errors/http-error.class';
import { ILogger } from '../../../logger/logger.interface';
import { TYPES } from '../../../types';
import { ICityService } from '../services/city.service.interface';
import { ICityController } from './city.controller.interface';
import { CityCreateDto } from '../dto/city-create.dto';
import { ICityEntity } from '../models/city.entity.interface';
import { CityUpdateDto } from '../dto/city-update.dto';
import 'reflect-metadata';

@injectable()
export class CityController extends BaseController implements ICityController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CityService) private CityService: ICityService,
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
		{ body }: Request<{}, {}, CityCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const data = await this.CityService.create(body);
		if (!data) {
			return next(new HTTPError(422, 'Такой мероприятия city существует'));
		}
		this.ok(res, {
			status: true,
			message: 'City успешно создано',
			data,
		});
	}

	async findAll(req: Request, res: Response, next: NextFunction): Promise<ICityEntity[] | void> {
		const data = await this.CityService.find();
		if (!data) {
			return next(new HTTPError(422, 'Нет cities'));
		}
		this.ok(res, {
			status: true,
			message: 'City успешно получено',
			data,
		});
	}

	async findById(req: Request, res: Response, next: NextFunction): Promise<ICityEntity | void> {
		const { id } = req.params;
		const data = await this.CityService.findById(Number(id));
		if (!data) {
			return next(new HTTPError(422, 'Нет такого city'));
		}
		this.ok(res, {
			status: true,
			message: 'City успешно получено',
			data,
		});
	}

	async findByName(req: Request, res: Response, next: NextFunction): Promise<ICityEntity | void> {
		const { name } = req.params;
		const data = await this.CityService.findByName(name);
		if (!data) {
			return next(new HTTPError(422, 'Нет такого city'));
		}
		this.ok(res, {
			status: true,
			message: 'City успешно получено',
			data,
		});
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<ICityEntity | void> {
		const { id } = req.params;
		const params: CityUpdateDto = req.body;
		const data = await this.CityService.update(Number(id), params);
		if (!data) {
			return next(new HTTPError(422, 'Нет такого city'));
		}

		this.ok(res, { status: true, message: 'City успешно изменено', data });
	}

	async remove(req: Request, res: Response, next: NextFunction): Promise<ICityEntity | void> {
		const { id } = req.params;
		const result = await this.CityService.remove(Number(id));
		if (!result) {
			return next(new HTTPError(422, 'Нет такого city'));
		}
		this.ok(res, {
			status: true,
			message: 'City успешно удалено',
		});
	}
}
