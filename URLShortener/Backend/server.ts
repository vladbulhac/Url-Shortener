import { Application } from "./app";
import { ValidateEnv } from "./Utils/ValidateEnvs";

ValidateEnv();

let App: Application = new Application();
App.Listen();
