import axios from 'axios';
import { fetchLeagueData } from '../../src/apiService';

jest.mock('axios');

describe('fetchLeagueData', () => {
  const BASE_URL = 'https://api.football-data.org/v2';
  const API_TOKEN = 'mockToken';
  process.env.FOOTBALL_API_BASE_URL = BASE_URL;
  process.env.FOOTBALL_API_TOKEN = API_TOKEN;

  it('should fetch league data successfully', async () => {
    const leagueCode = 'TEST_LEAGUE';
    const competitionData = { id: 1, name: 'Competition A' };
    const teamsData = { teams: [{ id: 1, name: 'Team A' }] };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: competitionData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: teamsData });

    const result = await fetchLeagueData(leagueCode);

    expect(result).toEqual({ competitionData, teamsData });
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/competitions/${leagueCode}`, { headers: { 'X-Auth-Token': API_TOKEN } });
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/competitions/${leagueCode}/teams`, { headers: { 'X-Auth-Token': API_TOKEN } });
  });

  it('should throw an error if fetching league data fails', async () => {
    const leagueCode = 'TEST_LEAGUE';

    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchLeagueData(leagueCode)).rejects.toThrow('Error fetching league data: Network error');
  });
});
