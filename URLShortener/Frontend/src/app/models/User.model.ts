import {Url} from './Url.model';

export interface User{
    _id:string;
    email: string;
    urlHistory?: string[];
   customUrls?:Url[];
}