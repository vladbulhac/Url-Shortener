export class ConvertShortService {
  private static Letters_Numbers_Map: Map<number, string>;
  private static _instance: ConvertShortService;

  public static GetInstance(): ConvertShortService {
    if (!this._instance) {
      this._instance = new ConvertShortService();
      this.BuildLetterNumberMap();
    }
    return this._instance;
  }

  public static ShortUrl(Url: string): string {
    let UrlNumber: number = this.ConvertLettersInIdToNumber(Url);
    let NewUrl: string = "";
    let TotalCharacters: number = this.Letters_Numbers_Map.size;
    while (UrlNumber > 0) {
      let Remainder: number = UrlNumber % TotalCharacters;
      NewUrl += Remainder;
      UrlNumber /= TotalCharacters;
    }

    return this.BuildUrl(NewUrl);
  }

  private static BuildUrl(ShortUrlNumber: string) {
    let ShortUrl: string = "";
    for (let c of ShortUrlNumber) {
      ShortUrl += this.Letters_Numbers_Map.get(Number(c));
    }

    return ShortUrl;
  }

  private static ConvertLettersInIdToNumber(Url: string): number {
    let UrlNumber: number = 0;
    for (let i = 0; i < Url.length; i++) {
      let CharacterMapIndex: number = Url[i].charCodeAt(0);
      if (CharacterMapIndex === 0) UrlNumber = UrlNumber * 10;
      else {
        while (CharacterMapIndex > 0) {
          UrlNumber = UrlNumber * 10 + (CharacterMapIndex % 10);
          CharacterMapIndex /= 10;
        }
      }
    }

    return UrlNumber;
  }

  private static BuildLetterNumberMap(): void {
    this.Letters_Numbers_Map = new Map<number, string>();
    for (let i = 0; i < 26; i++) {
      this.Letters_Numbers_Map.set(i,String.fromCharCode(97 + i));
      this.Letters_Numbers_Map.set(i,String.fromCharCode(65 + i));
      if (i < 10) this.Letters_Numbers_Map.set(i,String.fromCharCode(48 + i));
    }
  }
}
