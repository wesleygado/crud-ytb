import { DataSource, DataSourceOptions } from "typeorm";

export const configProd: DataSourceOptions = {
  type: 'sqlite',
  database: '.db/sql',
  synchronize: true,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
};

export const configTest: DataSourceOptions = {
  type: 'sqlite',
  database: '.dbTest/sql',
  synchronize: true,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
};