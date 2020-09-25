import { Router } from "express";

export abstract class IController {
  abstract Router: Router;
  abstract Path: string;
}
