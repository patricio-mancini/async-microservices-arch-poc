import { processLeagueData } from '../../src/dataProcessor';

describe('processLeagueData', () => {
  it('should process league data correctly', () => {
    const competitionData = {
      id: 1,
      name: 'Competition A',
      code: 'COMP_A',
      area: { name: 'Area A' },
    };
    const teamsData = {
      teams: [
        {
          id: 1,
          name: 'Team A',
          tla: 'TLA',
          shortName: 'Short A',
          area: { name: 'Area A' },
          address: 'Address A',
          squad: [{ id: 1, name: 'Player A', position: 'Forward', dateOfBirth: '1990-01-01', nationality: 'Country A' }],
          coach: { id: 1, name: 'Coach A', dateOfBirth: '1980-01-01', nationality: 'Country A' },
        },
      ],
    };

    const leagueData = processLeagueData(competitionData, teamsData);

    expect(leagueData).toEqual({
      competition: {
        competitionId: 1,
        name: 'Competition A',
        code: 'COMP_A',
        areaName: 'Area A',
        teams: [1],
      },
      teams: [
        {
          teamId: 1,
          name: 'Team A',
          tla: 'TLA',
          shortName: 'Short A',
          areaName: 'Area A',
          address: 'Address A',
          players: [1],
          coach: 1,
        },
      ],
      players: [
        {
          playerId: 1,
          name: 'Player A',
          position: 'Forward',
          dateOfBirth: '1990-01-01',
          nationality: 'Country A',
          teamId: 1,
        },
      ],
      coaches: [
        {
          coachId: 1,
          name: 'Coach A',
          dateOfBirth: '1980-01-01',
          nationality: 'Country A',
          teamId: 1,
        },
      ],
    });
  });
});
