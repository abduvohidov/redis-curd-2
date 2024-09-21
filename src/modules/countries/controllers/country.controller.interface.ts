import { NextFunction, Request, Response } from 'express';
import { ICountriesEntity } from '../models/country.entity.interface';

export interface ICountriesController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	findAll: (req: Request, res: Response, next: NextFunction) => Promise<ICountriesEntity[] | void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<ICountriesEntity | void>;
	findByName: (req: Request, res: Response, next: NextFunction) => Promise<ICountriesEntity | void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<ICountriesEntity | void>;
	remove: (req: Request, res: Response, next: NextFunction) => Promise<ICountriesEntity | void>;
}
