import {App} from './app';
import { UserController } from './Controllers/UserController';
import { UrlController } from './Controllers/UrlController';

let Application:App=new App([
    new UserController(),
    new UrlController()
]);

Application.Listen();