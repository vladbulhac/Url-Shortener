import {User} from '../models/User.model';

export interface registerDTO{
    data:registerData;
}

interface registerData{
    registerData:registerInfo
}

interface registerInfo{
    user:User,
    token:string
}