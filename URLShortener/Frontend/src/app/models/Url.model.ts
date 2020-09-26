export interface Url{
    _id:string;
    shortUrl: string;
    trueUrl: string;
    accessNumber: number;
    TTL: string;
    extendedTTL:boolean;
    isActive:boolean;
}