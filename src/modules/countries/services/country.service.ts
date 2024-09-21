import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { ICountriesService } from './country.service.interface';
import { ICountriesRepository } from '../repositories/country.repository.interface';
import { CountriesCreateDto } from '../dto/country-create.dto';
import { ICountriesEntity } from '../models/country.entity.interface';
import { CountriesEntity } from '../models/country.entity';
import { CountriesUpdateDto } from '../dto/country-update.dto';

@injectable()
export class CountriessService implements ICountriesService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CountriesRepository) private CountriesRepository: ICountriesRepository,
	) {}

	async createCountries(params: CountriesCreateDto): Promise<ICountriesEntity | null> {
		const newCountries = new CountriesEntity(params.id, params.name);
		const existedCountries = await this.CountriesRepository.findByName(params.name);
		if (existedCountries) {
			return null;
		}
		return await this.CountriesRepository.create(newCountries);
	}

	async find(): Promise<ICountriesEntity[]> {
		return await this.CountriesRepository.find();
	}

	async findById(id: number): Promise<ICountriesEntity | null> {
		return await this.CountriesRepository.findById(id);
	}

	async findByName(name: string): Promise<ICountriesEntity | null> {
		return await this.CountriesRepository.findByName(name);
	}

	async update(id: number, params: CountriesUpdateDto): Promise<ICountriesEntity | null> {
		const existedCountries = await this.CountriesRepository.findById(id);
		if (!existedCountries) {
			return null;
		}

		return await this.CountriesRepository.update(id, params);
	}

	async remove(id: number): Promise<ICountriesEntity | null> {
		const existedCountries = await this.CountriesRepository.findById(id);
		if (!existedCountries) {
			return null;
		}
		return await this.CountriesRepository.remove(id);
	}
}
