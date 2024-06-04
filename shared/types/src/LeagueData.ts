import { Competition, Team, Player, Coach } from './';

export default interface LeagueData {
  competition: Competition;
  teams: Team[];
  players?: Player[];
  coaches: Coach[];
}

export type LeagueCode = string;