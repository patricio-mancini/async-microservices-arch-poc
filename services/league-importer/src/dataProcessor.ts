import { LeagueData } from '@async-msa-poc/types';

export function processLeagueData(competitionData: any, teamsData: any): LeagueData {
  const competition = {
    competitionId: competitionData.id,
    name: competitionData.name,
    code: competitionData.code,
    areaName: competitionData.area.name,
    teams: teamsData.teams.map((team: any) => team.id),
  };

  const teams = teamsData.teams.map((team: any) => ({
    teamId: team.id,
    name: team.name,
    tla: team.tla,
    shortName: team.shortName,
    areaName: team.area.name,
    address: team.address,
    players: team.squad.map((player: any) => player.id),
    coach: team.coach.id,
  }));

  const players: any[] = [];
  const coaches: any[] = [];
  teamsData.teams.forEach((team: any) => {
    team.squad.forEach((player: any) => {
      players.push({
        playerId: player.id,
        name: player.name,
        position: player.position,
        dateOfBirth: player.dateOfBirth,
        nationality: player.nationality,
        teamId: team.id,
      });
    });
    if (team.coach) {
      coaches.push({
        coachId: team.coach.id,
        name: team.coach.name,
        dateOfBirth: team.coach.dateOfBirth,
        nationality: team.coach.nationality,
        teamId: team.id,
      });
    }
  });

  return { competition, teams, players, coaches };
}
