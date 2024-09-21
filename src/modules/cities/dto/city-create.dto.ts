import { IsString, IsDateString } from 'class-validator';

export class CityCreateDto {
	@IsString()
	id: number;

	@IsString()
	name: string;
}
