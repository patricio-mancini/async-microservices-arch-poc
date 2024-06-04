import { saveLeagueData } from '../../../src/operations/leagueData';
import { Competition, Team, Player, Coach } from '../../../src/models';

jest.mock('../../../src/models/Competition');
jest.mock('../../../src/models/Team');
jest.mock('../../../src/models/Player');
jest.mock('../../../src/models/Coach');

describe('saveLeagueData Operation', () => {
  it('should save league data to MongoDB', async () => {
    const leagueData = {
      competition: {
        competitionId: 1,
        name: 'Competition A',
        code: 'COMP_A',
        areaName: 'Area A',
        teams: [1]
      },
      teams: [{ teamId: 1, name: 'Team A' }],
      players: [{ playerId: 1, name: 'Player A' }],
      coaches: [{ coachId: 1, name: 'Coach A' }]
    };

    const competitionMock = Competition.findOneAndUpdate as jest.Mock;
    const teamMock = Team.findOneAndUpdate as jest.Mock;
    const playerMock = Player.findOneAndUpdate as jest.Mock;
    const coachMock = Coach.findOneAndUpdate as jest.Mock;

    competitionMock.mockResolvedValue(leagueData.competition);
    teamMock.mockResolvedValue(leagueData.teams[0]);
    playerMock.mockResolvedValue(leagueData.players[0]);
    coachMock.mockResolvedValue(leagueData.coaches[0]);

    await saveLeagueData(leagueData as any);
    expect(competitionMock).toHaveBeenCalledWith(
      { competitionId: leagueData.competition.competitionId },
      leagueData.competition,
      { upsert: true, new: true }
    );
    expect(teamMock).toHaveBeenCalledWith(
      { teamId: leagueData.teams[0].teamId },
      leagueData.teams[0],
      { upsert: true, new: true }
    );
    expect(playerMock).toHaveBeenCalledWith(
      { playerId: leagueData.players[0].playerId },
      leagueData.players[0],
      { upsert: true, new: true }
    );
    expect(coachMock).toHaveBeenCalledWith(
      { coachId: leagueData.coaches[0].coachId },
      leagueData.coaches[0],
      { upsert: true, new: true }
    );
  });

  it('should log error if saving fails', async () => {
    const leagueData = {
      competition: {
        competitionId: 1,
        name: 'Competition A',
        code: 'COMP_A',
        areaName: 'Area A',
        teams: [1]
      },
      teams: [{ teamId: 1, name: 'Team A' }],
      players: [{ playerId: 1, name: 'Player A' }],
      coaches: [{ coachId: 1, name: 'Coach A' }]
    };

    const competitionMock = Competition.findOneAndUpdate as jest.Mock;
    competitionMock.mockRejectedValue(new Error('MongoDB error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    await expect(saveLeagueData(leagueData as any)).rejects.toThrow('MongoDB error');
    expect(errorSpy).toHaveBeenCalledWith('Error saving league data to MongoDB:', expect.any(Error));
  });
});
