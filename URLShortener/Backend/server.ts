import {Application} from './app';
import {ValidateEnv} from './Utils/ValidateEnvs';
import { UserController } from './Controllers/UserController';
import { UrlController } from './Controllers/UrlController';
import { UserRepository } from './Repositories/UserRepositories/UserRepository';

ValidateEnv();
let App:Application=new Application([
    new UserController(new UserRepository())
]);

App.Listen();