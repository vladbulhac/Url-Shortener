import md5 from "md5";
import { IUrlConversionService } from "./IUrlConversionService";

export class UrlConversionService implements IUrlConversionService {
  private UrlConversionCharacters:string[];

  constructor() {
    this.UrlConversionCharacters=process.env.URL_CONVERSIONCHARACTERS!.split('');
  }

  public ShortUrl(longUrl:string):string{
    let hashedUrl:string=md5(longUrl).slice(0,7);
    let hashedUrl_number:number=parseInt(hashedUrl,16);

    let totalCharacters: number = this.UrlConversionCharacters.length;
    let baseConversionDigits:number[]=[];
    while (hashedUrl_number != 0) {
      baseConversionDigits.push( hashedUrl_number % totalCharacters);
      hashedUrl_number = Math.floor(hashedUrl_number / totalCharacters);
    }
    return this.EncodeDigits(baseConversionDigits);
  }

  private EncodeDigits(
    baseConversionDigits: number[]
  ): string {
    let newUrl: string = "";
    for(let number of baseConversionDigits)
    {
      newUrl+=this.UrlConversionCharacters[number];
    }
    return newUrl;
  }
}
