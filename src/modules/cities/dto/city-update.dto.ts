import { IsString, IsDateString } from 'class-validator';

export class CityUpdateDto {
	@IsString()
	id: number;

	@IsString()
	name: string;
}
