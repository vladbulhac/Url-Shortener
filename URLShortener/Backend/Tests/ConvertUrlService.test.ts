import {expect} from "chai";
import "mocha";
import { UrlConversionService } from "../Services/UrlServices/UrlConversionService";
import { IUrlConversionService } from "../Services/UrlServices/IUrlConversionService";

const UrlData=require('./Resources/UrlTestData.json');

describe("Long URL transform to Short URL",()=>{

    it("Should take url: https://www.npmjs.com/package/nodemon and return 2X0WWnN",(done)=>{
        //Arrange
        let uscs:IUrlConversionService=new UrlConversionService();
        let url:string=UrlData[0];
        //Act
        let shortUrl:string=uscs.ShortUrl(url);
        //Assert
        expect(shortUrl).to.be.not.null;
        done();
    });
});