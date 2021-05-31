import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, database, connectionString }: dbConfig = config.get('dbConfig');

export const dbConnection = {
  url: `mongodb://${host}:${port}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  uri: connectionString,
};
