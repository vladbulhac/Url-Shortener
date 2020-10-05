import {Url} from './Url.model';

export interface User{
    _id?:string;
    password?:string;
    email: string;
    urlHistory?: string[];
   customUrls?:Url[];
   token?:string;
}