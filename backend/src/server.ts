process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import GameRoute from '@routes/game.route';
import validateEnv from '@utils/validateEnv';
import PlayRoute from './routes/playMaster.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new GameRoute(),
  new PlayRoute(),
]);

app.listen();
