import { expect } from "chai";
import express from "express";
import "mocha";
import * as mongoUnit from "mongo-unit";
import request from "supertest";
import { Url } from "url";
import { Application } from "../app";
import { User } from "../Models/User.model";
import { ICacheService } from "../Services/CacheServices/ICacheService";

const dbData = require("./Resources/DatabaseData.json");
const UrlData = require("./Resources/UrlTestData.json");
const users = dbData["users"];
const passwords = ["test_password1234", "test@!_|_password1234", "testTestest"];
let application: express.Application;
let appHelper: Application;
let cache: ICacheService;

before(() =>
  mongoUnit.start().then((url) => {
    appHelper = new Application(url);
    application = appHelper.GetApplication();
    cache = appHelper.GetCacheInstance();
  })
);

beforeEach(() => mongoUnit.load(dbData));

afterEach(() => {
  mongoUnit.drop();
  cache.DeleteAll();
});

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
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          await request(application)
            .put(`/v1/users/${response.body.data.loginData.user._id}`)
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
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .put("/v1/users" + "/" + id)
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

  describe("POST", () => {
    it("Should return an user, a token and status 200", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then((response) => {
          expect(response.body.data.loginData.user.email).to.be.equal(
            loginData.data.email
          );
          expect(response.body.data.loginData.token).to.not.be.null;
        });
    });

    it("Should return a new user, a token and status 201", async () => {
      const registerBody = {
        data: {
          email: "testEmail@test.com",
          password: "passTest1234",
        },
      };
      return request(application)
        .post("/v1/users/register")
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
        .post("/v1/users/register")
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
        .post("/v1/users/register")
        .send(userData)
        .expect(201)
        .then((response) => {
          const id: string = response.body.data.registerData.user._id;
          const token: string = response.body.data.registerData.token;
          request(application)
            .delete("/v1/users/" + id)
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
        .post("/v1/urls")
        .expect(201)
        .send({ data: { url: UrlData.data[0] } })
        .then((response) => {
          expect(response.body.data.url).to.be.equal("WutmF");
        });
    });

    it("logged in user should add url:https://github.com/remy/nodemon#nodemon to database and return a custom url: testurl with status code 201", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .post("/v1/urls/u/" + id)
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

    it("logged in user should add url:https://stackoverflow.com/ to database and add the custom url: stackO to the user's customUrls array", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .post("/v1/urls/u/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .send({
              data: {
                url: "https://stackoverflow.com/",
                custom: "stackO",
              },
            })
            .expect(201)
            .then(async () => {
              await request(application)
                .get("/v1/users/" + id)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set({ Authorization: `Bearer ${token}` })
                .expect(200)
                .then((response) => {
                  const user: User = response.body.data.user;
                  expect(
                    user.customUrls![user.customUrls!.length - 1]
                  ).to.have.property("shortUrl", "stackO");
                });
            });
        });
    });

    it("logged in user should have url:https://stackoverflow.com/ in his urlHistory array after accessing the shortUrl:stackO", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      return request(application)
        .post("/v1/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id: string = response.body.data.loginData.user._id;
          const token: string = response.body.data.loginData.token;
          await request(application)
            .post("/v1/urls/u/" + id)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set({ Authorization: `Bearer ${token}` })
            .send({
              data: {
                url: "https://stackoverflow.com/",
                custom: "stackO",
              },
            })
            .expect(201)
            .then(async () => {
              await request(application)
                .get("/v1/urls/stackO/u/" + id)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set({ Authorization: `Bearer ${token}` })
                .expect(200)
                .then(async () => {
                  await request(application)
                    .get("/v1/users/" + id)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .then((response) => {
                      const user: User = response.body.data.user;
                      expect(
                        user.urlHistory![user.urlHistory!.length - 1]
                      ).to.contain("https://stackoverflow.com/");
                    });
                });
            });
        });
    });
    describe("/GET", () => {
      it("should return status code 200 and the original url:https://github.com/remy/nodemon#nodemon after an anonymous request for url:WutmF", () => {
        return request(application)
          .post("/v1/urls")
          .expect(201)
          .send({ data: { url: UrlData.data[0] } })
          .then(async (response) => {
            expect(response.body.data.url).to.be.equal("WutmF");
            const url: string = response.body.data.url;
            await request(application)
              .get("/v1/urls/" + url)
              .expect(200)
              .then((response) => {
                expect(response.body.data.url).to.be.equal(UrlData.data[0]);
              });
          });
      });

      it("should return status code 200 and the original url:https://github.com/remy/nodemon#nodemon after an user requests for custom url:testurl", () => {
        const loginData = {
          data: {
            email: users[2].email,
            password: passwords[2],
          },
        };
        return request(application)
          .post("/v1/users/login")
          .send(loginData)
          .expect(200)
          .then(async (response) => {
            const id: string = response.body.data.loginData.user._id;
            const token: string = response.body.data.loginData.token;
            await request(application)
              .post("/v1/urls/u/" + id)
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
                const url: string = response.body.data.url;
                await request(application)
                  .get("/v1/urls/" + url)
                  .expect(200)
                  .then((response) => {
                    expect(response.body.data.url).to.be.equal(UrlData.data[0]);
                  });
              });
          });
      });
      it("should return top 10 most accessed active urls and status code 200", async () => {
        const expectedTop= [
          {
              "accessNumber": 34,
              "isActive": true,
              "_id": "5f6b44e4bfbf660e0447f0a4",
              "trueUrl": "https://testy.org",
              "shortUrl": "stfJ",
              "TTL": "1970-01-01T00:00:00.002Z",
              "__v": 0,
              "id": "5f6b44e4bfbf660e0447f0a4"
          },
          {
              "accessNumber": 23,
              "isActive": true,
              "_id": "5f6290cdd7eea23f90ba98fb",
              "trueUrl": "https://gbambu.com/r1251fsaga@@135xfa_12512z",
              "extendedTTL": true,
              "shortUrl": "HpnGK",
              "TTL": "1970-01-01T00:00:00.003Z",
              "__v": 0,
              "id": "5f6290cdd7eea23f90ba98fb"
          },
          {
              "accessNumber": 10,
              "isActive": true,
              "_id": "5f7c758aa6b09a1b444aecfd",
              "trueUrl": "https://emag.ro",
              "shortUrl": "EdtiB",
              "TTL": "1970-01-01T00:00:00.002Z",
              "__v": 0,
              "id": "5f7c758aa6b09a1b444aecfd"
          },
          {
              "accessNumber": 10,
              "isActive": true,
              "_id": "5f84918bcac70b5954586b9b",
              "trueUrl": "https://www.glassdoor.com/Job/ia%C5%9Fi-jobs-SRCH_IL.0,4_IC3235082.htm?sortBy=date_desc",
              "extendedTTL": true,
              "shortUrl": "glassD",
              "TTL": "1970-01-01T00:00:00.003Z",
              "__v": 0,
              "id": "5f84918bcac70b5954586b9b"
          },
          {
              "accessNumber": 3,
              "isActive": true,
              "_id": "5f7c8091a6b09a1b444aecfe",
              "trueUrl": "https://medium.com/swlh/angular-9-candeactivate-route-guard-example-1329fd0b4653",
              "shortUrl": "6pQPL",
              "TTL": "1970-01-01T00:00:00.002Z",
              "__v": 0,
              "id": "5f7c8091a6b09a1b444aecfe"
          },
          {
              "accessNumber": 3,
              "isActive": true,
              "_id": "5f7c80b1a6b09a1b444aecff",
              "trueUrl": "https://typegoose.github.io/typegoose/docs/api/decorators/prop",
              "shortUrl": "pH6VR",
              "TTL": "1970-01-01T00:00:00.002Z",
              "__v": 0,
              "id": "5f7c80b1a6b09a1b444aecff"
          },
          {
              "accessNumber": 2,
              "isActive": true,
              "_id": "5f6b476584b43c4ffc3d5854",
              "trueUrl": "https://testosten.org",
              "shortUrl": "OJiyC",
              "TTL": "1970-01-01T00:00:00.031Z",
              "__v": 0,
              "id": "5f6b476584b43c4ffc3d5854"
          },
          {
              "accessNumber": 2,
              "isActive": true,
              "_id": "5f6b47b44e4088371ccc82d0",
              "trueUrl": "https://testoisten.org",
              "shortUrl": "6BNiL",
              "TTL": "1970-01-01T00:00:00.031Z",
              "__v": 0,
              "id": "5f6b47b44e4088371ccc82d0"
          },
          {
              "accessNumber": 2,
              "isActive": true,
              "_id": "5f6b48323338fd27bca93cb5",
              "trueUrl": "https://etestoisten.org",
              "shortUrl": "pwgZG",
              "TTL": "1970-01-01T00:00:00.031Z",
              "__v": 0,
              "id": "5f6b48323338fd27bca93cb5"
          },
          {
              "accessNumber": 2,
              "isActive": true,
              "_id": "5f6b4890f837a5439c2dfc49",
              "trueUrl": "https://etessagagstoisten.org",
              "shortUrl": "u7OFI",
              "TTL": "1970-01-01T00:00:00.031Z",
              "__v": 0,
              "id": "5f6b4890f837a5439c2dfc49"
          }
      ]
        return request(application)
          .get("/v1/urls/leaderboard")
          .expect(200)
          .then((response) => {
            const top: Url[] = response.body.data.urls;
            expect(top).to.be.length(10);
            //expect(top).to.eql(expectedTop);
          });
      });
    });
  });
});
