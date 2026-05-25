import { graphicTemplates, matches, notifications, players, standings, teams, tournaments } from "@/data/mock-data";
import { useAppStore } from "@/store/app-store";

const allTeams = () => [...teams, ...useAppStore.getState().customTeams];
const allTournaments = () => [...tournaments, ...useAppStore.getState().customTournaments];

export const repository = {
  getTournaments: () => allTournaments(),
  getTournamentById: (id: string) => allTournaments().find((t) => t.id === id),
  getTeams: () => allTeams(),
  getTeamById: (id: string) => allTeams().find((team) => team.id === id),
  getPlayersByTeam: (teamId: string) => players.filter((player) => player.teamId === teamId),
  getPlayerById: (id: string) => players.find((player) => player.id === id),
  getMatchesByTournament: (tournamentId: string) => matches.filter((match) => match.tournamentId === tournamentId),
  getMatchById: (id: string) => matches.find((match) => match.id === id),
  getLiveMatch: () => matches.find((match) => match.status === "live"),
  getStandings: () => standings,
  getStandingsByTournament: (tournamentId: string) => standings.filter((s) => s.tournamentId === tournamentId),
  getGraphicTemplates: () => graphicTemplates,
  getNotifications: () => notifications,
};
