import { Team as ITeam, Player as IPlayer, Coach as ICoach } from '@async-msa-poc/types';
import { Player, Team, Coach } from '../models';

type GetTeamReturnType = { team: ITeam, coach?: ICoach, players?: IPlayer[] };

export async function getTeam(name: string, resolvePlayers: boolean = false): Promise<GetTeamReturnType> {
  const team: ITeam | null = await Team.findOne({ name }).exec();
  if (!team) {
    throw new Error(`Team with name ${name} not found`);
  }

  if (resolvePlayers) {
    const coach: ICoach | null = await Coach.findOne({ coachId: team.coach }).exec();
    const players: IPlayer[] = await Player.find({ playerId: { $in: team.players } }).exec();
    if (players.length === 0) {
      return {
        team,
        coach
      };
    }

    return {
      team,
      coach,
      players
    };
  }

  return { team };
}
