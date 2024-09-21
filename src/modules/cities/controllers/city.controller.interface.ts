import { NextFunction, Request, Response } from 'express';
import { ICityEntity } from '../models/city.entity.interface';

export interface ICityController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	findAll: (req: Request, res: Response, next: NextFunction) => Promise<ICityEntity[] | void>;
	findById: (req: Request, res: Response, next: NextFunction) => Promise<ICityEntity | void>;
	findByName: (req: Request, res: Response, next: NextFunction) => Promise<ICityEntity | void>;
	update: (req: Request, res: Response, next: NextFunction) => Promise<ICityEntity | void>;
	remove: (req: Request, res: Response, next: NextFunction) => Promise<ICityEntity | void>;
}
