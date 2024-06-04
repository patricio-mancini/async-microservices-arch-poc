export default interface Team {
  teamId: number;
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  players: number[];
  coach: number;
}