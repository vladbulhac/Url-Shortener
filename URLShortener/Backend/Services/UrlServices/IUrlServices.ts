export abstract class IUrlServices {
  abstract CreateUrlByUser(
    userId: string,
    url: string,
    customUrl: string | undefined | null
  ): Promise<string>;
  abstract CreateUrl(url: string): Promise<string>;
  abstract GetUrl(url: string): Promise<string>;
}
