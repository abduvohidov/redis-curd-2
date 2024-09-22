import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { ICityRepository } from '../repositories/city.repository.interface';
import { CityEntity } from '../models/city.entity';
import { CityCreateDto } from '../dto/city-create.dto';
import { ICityService } from './city.service.interface';
import { ICityEntity } from '../models/city.entity.interface';
import { CityUpdateDto } from '../dto/city-update.dto';
import { IRedisService } from '../../../common/services/redis/redis.service.interface';

@injectable()
export class CitysService implements ICityService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CityRepository) private cityRepository: ICityRepository,
		@inject(TYPES.RedisService) private redisService: IRedisService,
	) {}

	private getRedisKey(id: number): string {
		return `city_${id}`;
	}

	async create(params: CityCreateDto): Promise<ICityEntity | null> {
		const existedCity = await this.cityRepository.findByName(params.name);
		if (existedCity) {
			return null;
		}

		const newCity = new CityEntity(params.id, params.name);
		const createdCity = await this.cityRepository.create(newCity);

		if (createdCity) {
			await this.redisService.set(
				this.getRedisKey(createdCity.id),
				JSON.stringify(createdCity),
				1000,
			);
		}
		return createdCity;
	}

	async find(): Promise<ICityEntity[]> {
		return await this.cityRepository.find();
	}

	async findById(id: number): Promise<ICityEntity | null> {
		const cachedCity = await this.redisService.get(this.getRedisKey(id));
		if (cachedCity) {
			return JSON.parse(cachedCity);
		}

		const city = await this.cityRepository.findById(id);
		if (city) {
			await this.redisService.set(this.getRedisKey(id), JSON.stringify(city), 1000);
		}
		return city;
	}

	async findByName(name: string): Promise<ICityEntity | null> {
		return await this.cityRepository.findByName(name);
	}

	async update(id: number, params: CityUpdateDto): Promise<ICityEntity | null> {
		const existedCity = await this.cityRepository.findById(id);
		if (!existedCity) {
			return null;
		}

		const updatedCity = await this.cityRepository.update(id, params);

		if (updatedCity) {
			await this.redisService.set(this.getRedisKey(id), JSON.stringify(updatedCity), 1000);
		}
		return updatedCity;
	}

	async remove(id: number): Promise<ICityEntity | null> {
		const existedCity = await this.cityRepository.findById(id);
		if (!existedCity) {
			return null;
		}

		const removedCity = await this.cityRepository.remove(id);
		return removedCity;
	}
}
