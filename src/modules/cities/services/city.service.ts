import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IConfigService } from '../../../config/config.service.interface';
import { ICityRepository } from '../repositories/city.repository.interface';
import { CityEntity } from '../models/city.entity';
import { CityCreateDto } from '../dto/city-create.dto';
import { ICityService } from './city.service.interface';
import { ICityEntity } from '../models/city.entity.interface';
import { CityUpdateDto } from '../dto/city-update.dto';

@injectable()
export class CitysService implements ICityService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CityRepository) private CityRepository: ICityRepository,
	) {}

	async create(params: CityCreateDto): Promise<ICityEntity | null> {
		const newCity = new CityEntity(params.id, params.name);
		const existedCity = await this.CityRepository.findByName(params.name);
		if (existedCity) {
			return null;
		}
		return await this.CityRepository.create(newCity);
	}

	async find(): Promise<ICityEntity[]> {
		return await this.CityRepository.find();
	}

	async findById(id: number): Promise<ICityEntity | null> {
		return await this.CityRepository.findById(id);
	}

	async findByName(name: string): Promise<ICityEntity | null> {
		return await this.CityRepository.findByName(name);
	}

	async update(id: number, params: CityUpdateDto): Promise<ICityEntity | null> {
		const existedCity = await this.CityRepository.findById(id);
		if (!existedCity) {
			return null;
		}

		return await this.CityRepository.update(id, params);
	}

	async remove(id: number): Promise<ICityEntity | null> {
		const existedCity = await this.CityRepository.findById(id);
		if (!existedCity) {
			return null;
		}
		return await this.CityRepository.remove(id);
	}
}
