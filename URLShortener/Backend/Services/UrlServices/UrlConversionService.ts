import md5 from "md5";
import { IUrlConversionService } from "./IUrlConversionService";

export class UrlConversionService implements IUrlConversionService {
  private IndexToCharsMap!: Map<number, string>;

  constructor() {
    this.BuildIndexToCharsMap();
  }

  public ShortUrl(longUrl:string):string{
    let hashedUrl:string=md5(longUrl).slice(0,7);
    let hashedUrl_number:number=parseInt(hashedUrl,16);

    let totalCharacters: number = this.IndexToCharsMap.size;
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
      newUrl+=this.IndexToCharsMap.get(number);
    }
    return newUrl;
  }


  private BuildIndexToCharsMap(): void {
    this.IndexToCharsMap = new Map<number, string>();

    let index: number = 0;
    let counter: number = 0;
    while (true) {
      if (counter <= 25)
        this.IndexToCharsMap.set(counter, String.fromCharCode(65 + index));
      else if (counter <= 51) {
        if (index === 27) index = 0;
        this.IndexToCharsMap.set(counter, String.fromCharCode(97 + index));
      } else if (counter <= 61) {
        if (index === 27) index = 0;
        this.IndexToCharsMap.set(counter, String.fromCharCode(48 + index));
      } else break;
      counter++;
      index++;
    }
  }
}
