const typeDefs = `#graphql
  type Competition {
    competitionId: ID!
    name: String!
    code: String!
    areaName: String!
    teams: [ID!]!
  }

  type Player {
    playerId: ID!
    name: String!
    position: String!
    dateOfBirth: String
    nationality: String!
  }

  type Coach {
    coachId: ID!
    name: String!
    dateOfBirth: String
    nationality: String!
  }

  type Participants {
    players: [Player!]
    coaches: [Coach!]
  }

  type GetPlayersResponse {
    competition: Competition!
    participants: Participants
  }

  type Team {
    teamId: ID!
    name: String!
    tla: String!
    shortName: String!
    areaName: String!
    address: String!
  }

  type GetTeamResponse {
    team: Team!
    coach: Coach
    players: [Player!]
  }

  type Query {
    getPlayers(leagueCode: String!, teamName: String): GetPlayersResponse
    getTeam(teamName: String!, resolvePlayers: Boolean): GetTeamResponse
  }

  type Mutation {
    importLeague(leagueCode: String!): String
  }
`;

export default typeDefs;
