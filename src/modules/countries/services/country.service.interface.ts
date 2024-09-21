import { CountriesCreateDto } from '../dto/country-create.dto';
import { CountriesUpdateDto } from '../dto/country-update.dto';
import { ICountriesEntity } from '../models/country.entity.interface';

export interface ICountriesService {
	createCountries: (params: CountriesCreateDto) => Promise<ICountriesEntity | null>;
	find: () => Promise<ICountriesEntity[]>;
	findById: (id: number) => Promise<ICountriesEntity | null>;
	findByName: (name: string) => Promise<ICountriesEntity | null>;
	update: (id: number, params: CountriesUpdateDto) => Promise<ICountriesEntity | null>;
	remove: (id: number) => Promise<ICountriesEntity | null>;
}
