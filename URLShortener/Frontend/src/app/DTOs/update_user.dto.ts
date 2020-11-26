import { User } from '../models/User.model';

export interface updateDTO {
  data: updatedData;
}

export interface updatedData {
  updatedData: User;
}
