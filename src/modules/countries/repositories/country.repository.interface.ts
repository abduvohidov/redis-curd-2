import { ICountriesEntity } from '../models/country.entity.interface';

export interface ICountriesRepository {
	create: (params: ICountriesEntity) => Promise<ICountriesEntity>;
	find: () => Promise<ICountriesEntity[]>;
	findById: (id: number) => Promise<ICountriesEntity | null>;
	findByName: (name: string) => Promise<ICountriesEntity | null>;
	update: (id: number, params: ICountriesEntity) => Promise<ICountriesEntity | null>;
	remove: (id: number) => Promise<ICountriesEntity | null>;
}
