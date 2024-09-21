import { ICountriesEntity } from './country.entity.interface';

export class CountriesEntity implements ICountriesEntity {
	constructor(private readonly _id: number, private readonly _name: string) {}

	get id(): number {
		return this._id;
	}

	get name(): string {
		return this._name;
	}
}
