import { Url } from '../models/Url.model';

export interface leaderboardDTO {
  data: leaderboardBody;
}

interface leaderboardBody {
  urls: Url[];
}
