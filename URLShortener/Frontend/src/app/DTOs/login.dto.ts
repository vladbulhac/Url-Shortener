import {User} from '../models/User.model';

export interface loginDTO{
    data:loginData;
}


interface loginData{
    loginData:loginInfo;
}

interface loginInfo{
    user:User;
    token:string;
    message:string;
}
