import { ICityEntity } from '../models/city.entity.interface';

export interface ICityRepository {
	create: (params: ICityEntity) => Promise<ICityEntity>;
	find: () => Promise<ICityEntity[]>;
	findById: (id: number) => Promise<ICityEntity | null>;
	findByName: (name: string) => Promise<ICityEntity | null>;
	update: (id: number, params: ICityEntity) => Promise<ICityEntity | null>;
	remove: (id: number) => Promise<ICityEntity | null>;
}
