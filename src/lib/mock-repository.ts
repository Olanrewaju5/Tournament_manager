import { graphicTemplates, matches, notifications, players, standings, teams, tournaments } from "@/data/mock-data";
import { useAppStore } from "@/store/app-store";
import { Match } from "@/types/domain";

const allTeams = () => [...teams, ...useAppStore.getState().customTeams];
const allTournaments = () => [...tournaments, ...useAppStore.getState().customTournaments];

function applyMatchEdit(match: Match): Match {
  const edit = useAppStore.getState().matchEdits[match.id];
  if (!edit) return match;
  return {
    ...match,
    homeScore: edit.homeScore,
    awayScore: edit.awayScore,
    status: edit.status,
    events: edit.events,
    ratings: edit.ratings,
  };
}

export const repository = {
  getTournaments: () => allTournaments(),
  getTournamentById: (id: string) => allTournaments().find((t) => t.id === id),
  getTeams: () => allTeams(),
  getTeamById: (id: string) => allTeams().find((team) => team.id === id),
  getPlayersByTeam: (teamId: string) => players.filter((player) => player.teamId === teamId),
  getPlayerById: (id: string) => players.find((player) => player.id === id),
  getMatchesByTournament: (tournamentId: string) =>
    matches.filter((m) => m.tournamentId === tournamentId).map(applyMatchEdit),
  getMatchById: (id: string) => {
    const base = matches.find((m) => m.id === id);
    return base ? applyMatchEdit(base) : undefined;
  },
  getLiveMatch: () => {
    const edit = useAppStore.getState().matchEdits;
    return matches
      .map(applyMatchEdit)
      .find((m) => m.status === "live");
  },
  getStandings: () => standings,
  getStandingsByTournament: (tournamentId: string) => standings.filter((s) => s.tournamentId === tournamentId),
  getGraphicTemplates: () => graphicTemplates,
  getNotifications: () => notifications,
};
