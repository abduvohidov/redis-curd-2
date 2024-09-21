import { IsString } from 'class-validator';

export class CountriesUpdateDto {
	@IsString()
	id: number;

	@IsString()
	name: string;
}
