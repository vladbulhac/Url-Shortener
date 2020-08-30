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
  /*
  public GenerateShortUrl(url: string): string {
    let randIdAsNumber: number = this.ConvertStringIdToNumber(url);

    let toNumberTransformedString: string = "";
    let totalCharacters: number = this.IndexToCharsMap.size;
    let baseConversionDigits:number[]=[];
    while (randIdAsNumber != 0) {
      baseConversionDigits.push( randIdAsNumber % totalCharacters);
      randIdAsNumber = Math.floor(randIdAsNumber / totalCharacters);
    }
    return this.EncodeDigits(baseConversionDigits);
  }
*/

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

  private ConvertStringIdToNumber(randId: string): number {
    let randIdAsNumber: number = 0;
    for (let i = 0; i <8; i++) {
      let charMapIndex: number = randId[i].charCodeAt(0);
      if (charMapIndex === 0) randIdAsNumber = randIdAsNumber * 10;
      else randIdAsNumber = randIdAsNumber * 10 + (charMapIndex % 10);
    }

    return randIdAsNumber;
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
    /*let index = 0;
    for (let counter= 0; counter <=25; counter++){
      this.indexToCharsMap.set(counter, String.fromCharCode(65 + index));
      index++;
    }
    index = 0;
    for (let counter = 26; counter <=51; counter++){
      this.indexToCharsMap.set(counter, String.fromCharCode(97 + index));
      index++;
    }
    index = 0;
    for (let counter = 52; counter <=61; counter++){
      this.indexToCharsMap.set(counter, String.fromCharCode(48 + index));
      index++;
    }*/
  }
}
