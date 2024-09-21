import { CityCreateDto } from '../dto/city-create.dto';
import { CityUpdateDto } from '../dto/city-update.dto';
import { ICityEntity } from '../models/city.entity.interface';

export interface ICityService {
	create: (params: CityCreateDto) => Promise<ICityEntity | null>;
	find: () => Promise<ICityEntity[]>;
	findById: (id: number) => Promise<ICityEntity | null>;
	findByName: (name: string) => Promise<ICityEntity | null>;
	update: (id: number, params: CityUpdateDto) => Promise<ICityEntity | null>;
	remove: (id: number) => Promise<ICityEntity | null>;
}
