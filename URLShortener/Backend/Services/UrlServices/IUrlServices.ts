import { Url } from "../../Models/Url.model";

export abstract class IUrlServices {
  abstract CreateUrlByUser(
    userId: string,
    url: string,
    customUrl: string | undefined | null
  ): Promise<string>;
  //abstract GetUrlByUser(url: string): Promise<string>;
  abstract CreateUrl(url: string): Promise<string>;
  abstract GetUrl(url: string): Promise<string>;
}
