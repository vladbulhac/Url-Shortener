export class ConvertShortService {
  private IndexToCharsMap!: Map<number, string>;

  constructor() {
      this.BuildIndexToCharsMap();
  }

  public ToShortTransform(Url: string): string {
    let UrlNumber: number = this.ConvertLettersFromIdToNumber(Url);
    let NewUrl: string = "";
    let TotalCharacters: number = this.IndexToCharsMap.size;
    while (UrlNumber > 0) {
      let Remainder: number = UrlNumber % TotalCharacters;
      NewUrl += Remainder;
      UrlNumber /= TotalCharacters;
    }

    return this.ConvertLettersToNumbersUrl(NewUrl);
  }

  private  ConvertLettersToNumbersUrl(ShortUrlNumber: string) {
    let ShortUrl: string = "";
    for (let c of ShortUrlNumber) {
      ShortUrl += this.IndexToCharsMap.get(Number(c));
    }

    return ShortUrl;
  }

  private ConvertLettersFromIdToNumber(Url: string): number {
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

  private  BuildIndexToCharsMap(): void {
    this.IndexToCharsMap = new Map<number, string>();
    for (let i = 0; i < 26; i++) {
      this.IndexToCharsMap.set(i, String.fromCharCode(97 + i));
      this.IndexToCharsMap.set(i, String.fromCharCode(65 + i));
      if (i < 10) this.IndexToCharsMap.set(i, String.fromCharCode(48 + i));
    }
  }
}
