import "mocha";
import express from "express";
import * as mongoUnit from "mongo-unit";
import request from "supertest";
import { expect } from "chai";
import { Application } from "../app";
import { UserRepository } from "../Repositories/UserRepositories/UserRepository";
import { TokenService } from "../Services/JWTokenServices/TokenService";
import { UrlController } from "../Controllers/UrlController";
import { UrlRepository } from "../Repositories/UrlRepositories/UrlRepository";
import { UrlConversionService } from "../Services/UrlServices/UrlConversionService";

let application: express.Application;
const UrlData = require("./Resources/UrlTestData.json");

before(() =>
  mongoUnit.start().then((url) => {
    application = new Application(
      [
        new UrlController(
          new UrlRepository(),
          new UserRepository(),
          new UrlConversionService(),
          new TokenService()
        ),
      ],
      url
    ).GetApplication();
  })
);

afterEach(() => mongoUnit.drop());

after(() => mongoUnit.stop());

describe("/url", () => {
  describe("GET", async () => {
    return request(application)
      .post("/")
      .send(UrlData.data[0])
      .expect(201)
      .then((response) => {
        expect(response.body.data).to.not.be.null;
        expect(response.body.data.url).to.be.equal("WutmF");
      });
  });
});
