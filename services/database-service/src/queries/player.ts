import { Competition as ICompetition, Team as ITeam, Player as IPlayer, Coach as ICoach } from '@async-msa-poc/types';
import { Competition, Player, Team, Coach } from '../models';

type GetPlayersReturnType = {
  competition: ICompetition,
  participants: { players?: IPlayer[], coaches?: ICoach[] }
};

export async function getPlayers(leagueCode: string, teamName?: string): Promise<GetPlayersReturnType> {
  const competition: ICompetition | null = await Competition.findOne({ code: leagueCode }).exec();
  if (!competition) {
    throw new Error(`Competition with league code ${leagueCode} not found`);
  }

  const teamQuery = { teamId: { $in: competition.teams } } as any;
  if (teamName) {
    teamQuery.name = teamName;
  }

  const teams: ITeam[] = await Team.find(teamQuery).exec();
  const playerIds: number[] = teams.reduce((ids, team) => ids.concat(team.players), [] as number[]);

  let players: IPlayer[] = [];
  if (playerIds.length > 0) {
    players = await Player.find({ playerId: { $in: playerIds } }).exec();
  }

  let coaches: ICoach[] = [];
  if (players.length === 0) {
    const coachIds: number[] = teams.map(team => team.coach);
    if (coachIds.length > 0) {
      coaches = await Coach.find({ coachId: { $in: coachIds } }).exec();
    }
  } else {
    const coachIds: number[] = teams.map(team => team.coach);
    if (coachIds.length > 0) {
      coaches = await Coach.find({ coachId: { $in: coachIds } }).exec();
    }
  }

  return {
    competition: {
      competitionId: competition.competitionId,
      name: competition.name,
      code: competition.code,
      areaName: competition.areaName,
      teams: competition.teams
    },
    participants: {
      ...(players.length > 0 && { players }),
      ...(coaches.length > 0 && { coaches })
    }
  };
}
