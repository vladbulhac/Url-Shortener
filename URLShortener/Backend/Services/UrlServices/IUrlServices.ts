export abstract class IUrlServices {
  abstract CreateUrl(
    url: string,
    userId?: string | undefined | null,
    customUrl?: string | undefined | null
  ): Promise<string>;
  abstract GetUrl(url: string): Promise<string>;
}
