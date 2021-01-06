import {expect} from "chai";
import "mocha";
import { IUrlConversionService } from "../Services/UrlServices/UrlConversionService/IUrlConversionService";
import { UrlConversionService } from "../Services/UrlServices/UrlConversionService/UrlConversionService";


const UrlData=require('./Resources/UrlTestData.json');

describe("Long URL convert to Short URL",()=>{

    it("Should take url: https://github.com/remy/nodemon#nodemon and return WvunF",(done)=>{
        //Arrange
        let ucs:IUrlConversionService=new UrlConversionService();
        let url:string=UrlData.data[0];
        //Act
        let shortUrl:string=ucs.ShortUrl(url);
        //Assert
        expect(shortUrl).to.be.not.null;
        expect(shortUrl).to.be.equal("WvunF");
        done();
    });
});