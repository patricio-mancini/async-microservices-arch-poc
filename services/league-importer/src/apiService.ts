import axios from 'axios';

async function fetchWithRetry(url: string, options: any, retries: number = 3, delay: number = 1000): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (error: any) {
      if (attempt === retries - 1) {
        throw new Error(`Failed to fetch after ${retries} attempts: ${error.message}`);
      }
      console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function fetchLeagueData(leagueCode: string): Promise<{ competitionData: any, teamsData: any }> {
  const BASE_URL = process.env.FOOTBALL_API_BASE_URL;
  const API_TOKEN = process.env.FOOTBALL_API_TOKEN;
  try {
    const options = { headers: { 'X-Auth-Token': API_TOKEN } };
    const requests = [
      fetchWithRetry(`${BASE_URL}/competitions/${leagueCode}`, options),
      fetchWithRetry(`${BASE_URL}/competitions/${leagueCode}/teams`, options),
    ];

    const [competitionResponse, teamsResponse] = await Promise.all(requests);

    const competitionData = competitionResponse.data;
    const teamsData = teamsResponse.data;

    return { competitionData, teamsData };
  } catch (error: any) {
    throw new Error(`Error fetching league data: ${error.message}`);
  }
}
