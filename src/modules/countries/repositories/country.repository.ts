import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { ICountriesRepository } from './country.repository.interface';
import { ICountriesEntity } from '../models/country.entity.interface';
import { PrismaService } from '../../../database/prisma.service';

@injectable()
export class CountriesRepository implements ICountriesRepository {
	constructor(@inject(TYPES.PrismaService) private prisma: PrismaService) {}
	/**
	 * @param CountriesData
	 * @returns */

	async create(params: ICountriesEntity): Promise<ICountriesEntity> {
		return await this.prisma.client.country.create({
			data: {
				id: params.id,
				name: params.name,
			},
		});
	}

	async find(): Promise<ICountriesEntity[]> {
		return await this.prisma.client.country.findMany();
	}

	async findById(id: number): Promise<ICountriesEntity | null> {
		return await this.prisma.client.country.findFirst({
			where: {
				id,
			},
		});
	}

	async findByName(name: string): Promise<ICountriesEntity | null> {
		return await this.prisma.client.country.findFirst({
			where: {
				name,
			},
		});
	}

	async update(id: number, params: ICountriesEntity): Promise<ICountriesEntity | null> {
		return await this.prisma.client.country.update({
			where: { id },
			data: {
				name: params.name,
			},
		});
	}

	async remove(id: number): Promise<ICountriesEntity | null> {
		return await this.prisma.client.country.delete({
			where: { id },
		});
	}
}
