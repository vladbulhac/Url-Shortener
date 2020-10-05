import { expect } from "chai";
import express from "express";
import "mocha";
import * as mongoUnit from "mongo-unit";
import request from "supertest";
import { Application } from "../app";
import { CacheService } from "../Services/CacheServices/CacheService";
import { ICacheService } from "../Services/CacheServices/ICacheService";


const dbData = require("./Resources/UserTestData.json");
const UrlData = require("./Resources/UrlTestData.json");
const users = dbData["users"];
const passwords = ["test_password1234", "test@!_|_password1234", "testTestest"];
let application: express.Application;
let appHelper:Application;
let cache:ICacheService;


before(() =>
  mongoUnit.start().then((url) => {
    appHelper=new Application(url);
    application = appHelper.GetApplication();
    cache=appHelper.GetCacheInstance();
  })
);

beforeEach(() => mongoUnit.load(dbData));

afterEach(() => {mongoUnit.drop();cache.DeleteAll()});

after(() => mongoUnit.stop());

describe("user controller endpoint /users", () => {
  describe("PUT", () => {
    it("Should return status 401 because no token has been provided", () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      const updateData = {
        data: {
          email: "updatedEmail@update.com",
        },
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          await request(application)
            .put(`/users/${response.body.data.loginData.user._id}`)
            .send(updateData)
            .expect(401);
        });
    });

    it("Should change email of logged in user and return status 200", () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      const updateData = {
        data: {
          email: "updatedEmail@update.com",
        },
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .put("/users" + "/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)
            .send(updateData)
            .then((response) => {
              expect(response.body.data.updatedData.email).to.be.eql(
                updateData.data.email
              );
            });
        });
    });
  });

  describe("GET", () => {
    it("Should return an user, a token and status 200", () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then((response) => {
          expect(response.body.data.loginData.user.email).to.be.equal(
            loginData.data.email
          );
          expect(response.body.data.loginData.token).to.not.be.null;
        });
    });
  });

  describe("POST", () => {
    it("Should return a new user, a token and status 201", async () => {
      const registerBody = {
        data: {
          email: "testEmail@test.com",
          password: "passTest1234",
        },
      };
      return request(application)
        .post("/users/register")
        .send(registerBody)
        .expect(201)
        .then((response) => {
          expect(response.body.data.registerData.user.email).to.be.equal(
            registerBody.data.email
          );
          expect(response.body.data.registerData.token).to.not.be.null;
          expect(response.body.data.registerData.message).to.be.equal(
            "Successful"
          );
        });
    });

    it("Should return status 409 when registering with existing user credentials", () => {
      const registerBody = {
        data: {
          email: users[0].email,
          password: passwords[0],
        },
      };
      return request(application)
        .post("/users/register")
        .send(registerBody)
        .expect(409);
    });
  });

  describe("DELETE", () => {
    it("should delete user and return status code 204", async () => {
      const userData = {
        data: {
          email: "newUser",
          password: "newUserPass",
        },
      };
      return request(application)
        .post("/users/register")
        .send(userData)
        .expect(201)
        .then((response) => {
          const id: string = response.body.data.registerData.user._id;
          const token: string = response.body.data.registerData.token;
          request(application)
            .delete("/users/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .expect(204)
            .then((response) => {
              expect(response).to.be.empty;
            });
        });
    });
  });
});

describe("url controller endpoint /", () => {
  describe("/POST", () => {
    it("should add url:https://github.com/remy/nodemon#nodemon to database and return its short version: WutmF", () => {
      return request(application)
        .post("")
        .expect(201)
        .send({ data: { url: UrlData.data[0] } })
        .then((response) => {
          expect(response.body.data.url).to.be.equal("WutmF");
        });
    });

    it("loggied in user should add url:https://github.com/remy/nodemon#nodemon to database and return a custom url: testurl", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .post("/u/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .send({
              data: {
                url: "https://github.com/remy/nodemon#nodemon",
                custom: "testurl",
              },
            })
            .expect(201)
            .then((response) => {
              expect(response.body.data.url).to.be.equal("testurl");
            });
        });
    });
  });
  describe("/GET", () => {
    it("should get the original url:https://github.com/remy/nodemon#nodemon after an anonymous request for url:WutmF", () => {
      return request(application)
        .post("")
        .expect(201)
        .send({ data: { url: UrlData.data[0] } })
        .then(async (response) => {
          expect(response.body.data.url).to.be.equal("WutmF");
          const url: string = response.body.data.url;
          await request(application)
            .get("/" + url)
            .expect(200)
            .then((response) => {
              expect(response.body.data.url).to.be.equal(UrlData.data[0]);
            });
        });
    });

    it("should get the original url:https://github.com/remy/nodemon#nodemon after an user requests for custom url:testurl", () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .post("/u/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .send({
              data: {
                url: UrlData.data[0],
                custom: "testurl",
              },
            })
            .expect(201)
            .then(async (response) => {
              expect(response.body.data.url).to.be.equal("testurl");
              const url: string = response.body.data.url;
              await request(application)
                .get("/" + url)
                .expect(200)
                .then((response) => {
                  expect(response.body.data.url).to.be.equal(UrlData.data[0]);
                });
            });
        });
    });
  });
});
