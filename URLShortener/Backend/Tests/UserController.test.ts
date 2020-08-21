import "mocha";
import express from "express";
import * as mongoUnit from "mongo-unit";
import request from "supertest";
import { expect } from "chai";
import { Application } from "../app";
import { UserController } from "../Controllers/UserController";
import { UserRepository } from "../Repositories/UserRepositories/UserRepository";
import { TokenService } from "../Services/JWTokenServices/TokenService";

const dbData = require("./Resources/UserTestData.json");
const users = dbData["users"];
const passwords = [
  "test_password1234",
  "test@!_|_password1234",
  "eatingTestsOnBread",
];
let application: express.Application;

before(() =>
  mongoUnit.start().then((url) => {
    application = new Application(
      [new UserController(new UserRepository(), new TokenService())],
      url
    ).GetApplication();
  })
);

beforeEach(() => mongoUnit.load(dbData));

afterEach(() => mongoUnit.drop());

after(() => mongoUnit.stop());

describe("/users", () => {
  describe("GET", () => {
    it("Should return a list of 2 users and status 200", async () => {
      return request(application)
        .get("/users")
        .expect(200)
        .then((response) => {
          expect(response.body.data.users).to.eql(users);
        });
    });

    it("Should return an user, a token and status 200", async () => {
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
    it("Should return an user, a token and status 200", async () => {
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

  describe("PUT", () => {
    it("Should return status 401 because no token has been",async ()=>{
        const loginData = {
            data: {
              email: users[2].email,
              password: passwords[2],
            },
          };
          const updateData = {
            data: {
              email: "updatedEmail@update.com",
            }
          };
          return request(application)
            .get("/users/login")
            .send(loginData)
            .expect(200)
            .then(async response=>{
                await request(application)
                .put(`/users/${response.body.data.loginData.user._id}`)
                .send(updateData)
                .expect(401);
            });
    });

    it("Should change email of logged in user and return status 200", async () => {
      const loginData = {
        data: {
          email: users[2].email,
          password: passwords[2],
        },
      };
      const updateData = {
        data: {
          email: "updatedEmail@update.com",
        }
      };
      return request(application)
        .get("/users/login")
        .send(loginData)
        .expect(200)
        .then(async (response) => {
          const id:string=response.body.data.loginData.user._id;
          const token:string=response.body.data.loginData.token;
        console.log(id);
        console.log(token);
          await request(application)
            .put(`/users/${response.body.data.loginData.user._id}`)
            .set(
                "Authorization",
                `Bearer ${response.body.data.loginData.token}`
              )
            .send(updateData)
            .expect(200)
            .then((response) => {
              expect(response.body.data.updatedData.email).to.be.equal(
                updateData.data.email
              );
            });
        });
    });
  });
});
