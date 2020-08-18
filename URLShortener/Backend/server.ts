import {Application} from './app';
import { UserController } from './Controllers/UserController';
import { UrlController } from './Controllers/UrlController';

let App:Application=new Application([
    new UserController()
]);

App.Listen();