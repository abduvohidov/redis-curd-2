import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { ICountriesService } from './country.service.interface';
import { ICountriesRepository } from '../repositories/country.repository.interface';
import { CountriesCreateDto } from '../dto/country-create.dto';
import { ICountriesEntity } from '../models/country.entity.interface';
import { CountriesEntity } from '../models/country.entity';
import { CountriesUpdateDto } from '../dto/country-update.dto';
import { IRedisService } from '../../../common/services/redis/redis.service.interface';

@injectable()
export class CountriessService implements ICountriesService {
	constructor(
		@inject(TYPES.RedisService) private redisService: IRedisService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CountriesRepository) private CountriesRepository: ICountriesRepository,
	) {}

	private getRedisKey(id: number): string {
		return `country_${id}`;
	}

	async createCountries(params: CountriesCreateDto): Promise<ICountriesEntity | null> {
		const existedCountries = await this.CountriesRepository.findByName(params.name);
		if (existedCountries) {
			return null;
		}

		const newCountries = new CountriesEntity(params.id, params.name);
		const createdCountry = await this.CountriesRepository.create(newCountries);

		if (createdCountry) {
			await this.redisService.set(
				this.getRedisKey(createdCountry.id),
				JSON.stringify(createdCountry),
				1000,
			);
		}
		return createdCountry;
	}

	async find(): Promise<ICountriesEntity[]> {
		return await this.CountriesRepository.find();
	}

	async findById(id: number): Promise<ICountriesEntity | null> {
		const cachedCountry = await this.redisService.get(this.getRedisKey(id));
		if (cachedCountry) {
			return JSON.parse(cachedCountry);
		}

		const country = await this.CountriesRepository.findById(id);
		if (country) {
			await this.redisService.set(this.getRedisKey(id), JSON.stringify(country), 1000);
		}
		return country;
	}

	async findByName(name: string): Promise<ICountriesEntity | null> {
		return await this.CountriesRepository.findByName(name);
	}

	async update(id: number, params: CountriesUpdateDto): Promise<ICountriesEntity | null> {
		const existedCountries = await this.CountriesRepository.findById(id);
		if (!existedCountries) {
			return null;
		}

		const updatedCountry = await this.CountriesRepository.update(id, params);

		if (updatedCountry) {
			await this.redisService.set(this.getRedisKey(id), JSON.stringify(updatedCountry), 1000);
		}
		return updatedCountry;
	}

	async remove(id: number): Promise<ICountriesEntity | null> {
		const existedCountries = await this.CountriesRepository.findById(id);
		if (!existedCountries) {
			return null;
		}

		const removedCountry = await this.CountriesRepository.remove(id);
		return removedCountry;
	}
}
