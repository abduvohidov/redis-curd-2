import { IsString } from 'class-validator';

export class CountriesCreateDto {
	@IsString()
	id: number;

	@IsString()
	name: string;
}
