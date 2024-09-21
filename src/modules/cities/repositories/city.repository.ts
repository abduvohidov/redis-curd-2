import { inject, injectable } from 'inversify';
import { ICityRepository } from './city.repository.interface';
import { TYPES } from '../../../types';
import { ICityEntity } from '../models/city.entity.interface';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class CityRepository implements ICityRepository {
	constructor(@inject(TYPES.PrismaService) private prisma: PrismaService) {}
	/**
	 * @param CityData
	 * @returns */

	async create(params: ICityEntity): Promise<ICityEntity> {
		return await this.prisma.client.city.create({
			data: {
				id: params.id,
				name: params.name,
			},
		});
	}

	async find(): Promise<ICityEntity[]> {
		return await this.prisma.client.city.findMany();
	}

	async findById(id: number): Promise<ICityEntity | null> {
		return await this.prisma.client.city.findFirst({
			where: {
				id,
			},
		});
	}

	async findByName(name: string): Promise<ICityEntity | null> {
		return await this.prisma.client.city.findFirst({
			where: { name },
		});
	}

	async update(id: number, params: ICityEntity): Promise<ICityEntity | null> {
		return await this.prisma.client.city.update({
			where: { id },
			data: {
				name: params.name,
			},
		});
	}

	async remove(id: number): Promise<ICityEntity | null> {
		return await this.prisma.client.city.delete({
			where: { id },
		});
	}
}
