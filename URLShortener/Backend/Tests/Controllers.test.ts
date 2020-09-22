import "mocha";
import express from "express";
import * as mongoUnit from "mongo-unit";
import request from "supertest";
import { expect } from "chai";
import { Application } from "../app";
import { UserController } from "../Controllers/UserController";
import { UserRepository } from "../Repositories/UserRepositories/UserRepository";
import { TokenService } from "../Services/JWTokenServices/TokenService";
import { IUrlConversionService } from "../Services/UrlServices/IUrlConversionService";
import { ICacheService } from "../Services/CacheRetrieveServices/ICacheService";
import { ITokenService } from "../Services/JWTokenServices/ITokenService";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";
import { IUrlRepository } from "../Repositories/UrlRepositories/IUrlRepository";
import { UrlController } from "../Controllers/UrlController";
import { CacheService } from "../Services/CacheRetrieveServices/CacheService";
import { UrlConversionService } from "../Services/UrlServices/UrlConversionService";
import { UrlRepository } from "../Repositories/UrlRepositories/UrlRepository";
import { LoginService } from "../Services/UserServices/LoginService";
import { RegisterService } from "../Services/UserServices/RegisterService";

const dbData = require("./Resources/UserTestData.json");
const UrlData = require("./Resources/UrlTestData.json");
const users = dbData["users"];
const passwords = ["test_password1234", "test@!_|_password1234", "testTestest"];
let application: express.Application;
let url_repository: IUrlRepository = new UrlRepository();
let user_repository: IUserRepository = new UserRepository();
let token_service: ITokenService = new TokenService();
let login_service:LoginService=new LoginService(user_repository,token_service);
let register_service:RegisterService=new RegisterService(user_repository,token_service);
let url_conversion_service: IUrlConversionService = new UrlConversionService();
let cache_service: ICacheService = new CacheService();

before(() =>
  mongoUnit.start().then((url) => {
    application = new Application(
      [new UserController(user_repository, token_service,login_service,register_service),
        new UrlController(
          url_repository,
          user_repository,
          url_conversion_service,
          token_service,
          cache_service
        ),
      ],
      url
    ).GetApplication();
  })
);


beforeEach(() => mongoUnit.load(dbData));

afterEach(() => mongoUnit.drop());

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

    it("Should change email of logged in user and return status 200",  () => {
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
            .put('/users'+'/'+id)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({ Authorization: `Bearer ${token}` })
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
    it("Should return an user, a token and status 200", () => {
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
            .delete('/users/'+id)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
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

    it("loggied in user should add url:https://github.com/remy/nodemon#nodemon to database and return a custom url: testurl", async() => {
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
  describe('/GET',()=>{
    it('should get the original url:https://github.com/remy/nodemon#nodemon after an anonymous request for url:WutmF',()=>{
      return request(application)
      .post("")
      .expect(201)
      .send({ data: { url: UrlData.data[0] } })
      .then(async(response) => {
        expect(response.body.data.url).to.be.equal("WutmF");      
        const url:string=response.body.data.url;
        await request(application)
                    .get('/'+url)
                    .expect(200)
                    .then(response=>{
                      expect(response.body.data.url).to.be.equal(UrlData.data[0]);
                    });
      });
    });

    it('should get the original url:https://github.com/remy/nodemon#nodemon after an user requests for custom url:testurl',()=>{
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
            .then(async(response) => {
              expect(response.body.data.url).to.be.equal("testurl");
              const url:string=response.body.data.url;
              await request(application)
                        .get('/'+url)
                        .expect(200)
                        .then(response=>{
                          expect(response.body.data.url).to.be.equal(UrlData.data[0]);
                        });
            });
        });
    });

  });
});
