export const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	ExeptionFilter: Symbol.for('ExeptionFilter'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaClient: Symbol.for('PrismaClient'),
	PrismaService: Symbol.for('PrismaService'),
	RedisService: Symbol.for('RedisService'),
	EmailService: Symbol.for('EmailService'),

	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),
	UserModel: Symbol.for('UserModel'),
	UserRepository: Symbol.for('UserRepository'),

	CityController: Symbol.for('CityController'),
	CityService: Symbol.for('CityService'),
	CityModel: Symbol.for('CityModel'),
	CityRepository: Symbol.for('CityRepository'),

	CountriesController: Symbol.for('CountriesController'),
	CountriesService: Symbol.for('CountriesService'),
	CountriesModel: Symbol.for('CountriesModel'),
	CountriesRepository: Symbol.for('CountriesRepository'),
};
