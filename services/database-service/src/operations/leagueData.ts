import { LeagueData } from '@async-msa-poc/types';
import { Competition, ICompetition, Team, ITeam, Player, Coach } from '../models';

export async function saveLeagueData(leagueData: LeagueData): Promise<void> {
  try {
    const competition: ICompetition = await Competition.findOneAndUpdate(
      { competitionId: leagueData.competition.competitionId },
      leagueData.competition,
      { upsert: true, new: true }
    );

    const teams: ITeam[] = await Promise.all(leagueData.teams.map(async (team) => {
      return await Team.findOneAndUpdate(
        { teamId: team.teamId },
        team,
        { upsert: true, new: true }
      );
    }));

    if (leagueData.players) {
      await Promise.all(leagueData.players.map(async (player) => {
        await Player.findOneAndUpdate(
          { playerId: player.playerId },
          player,
          { upsert: true, new: true }
        );
      }));
    }

    if (leagueData.coaches) {
      await Promise.all(leagueData.coaches.map(async (coach) => {
        await Coach.findOneAndUpdate(
          { coachId: coach.coachId },
          coach,
          { upsert: true, new: true }
        );
      }));
    }
  } catch (error) {
    console.error('Error saving league data to MongoDB:', error);
    throw error;
  }
}