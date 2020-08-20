import {expect} from "chai";
import "mocha";
import { UrlShortConversionService } from "../Services/UrlServices/UrlShortConversionService";

const UrlData=require('./Resources/UrlTestData.json');

describe("Long URL transform to Short URL",()=>{

    it("Should take id a9Agab12asSb and return 2X0WWnN",(done)=>{
        //Arrange
        let uscs:UrlShortConversionService=new UrlShortConversionService();
        let id:string="a9Agab12asSb";
        //Act
        let shortUrl:string=uscs.GenerateShortUrl(id);
        //Assert
        expect(shortUrl).to.be.equal("2X0WWnN");
        done();
    });
});