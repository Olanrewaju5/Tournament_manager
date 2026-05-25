import { create } from "zustand";
import { Match, MatchEvent, MatchStatus, PlayerRating, Team, Tournament, UserRole } from "@/types/domain";

type MatchEdit = {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  events: MatchEvent[];
  ratings: PlayerRating[];
};

type AppState = {
  hasCompletedOnboarding: boolean;
  selectedRole: UserRole;
  selectedTournamentId: string;
  followedTeamIds: string[];
  customTeams: Team[];
  customTournaments: Tournament[];
  matchEdits: Record<string, MatchEdit>;
  completeOnboarding: () => void;
  setSelectedRole: (role: UserRole) => void;
  setSelectedTournamentId: (id: string) => void;
  toggleFollowedTeam: (id: string) => void;
  addTeam: (team: Team) => void;
  addTournament: (tournament: Tournament) => void;
  initMatchEdit: (match: Match) => void;
  updateMatchScore: (matchId: string, team: "home" | "away", delta: number) => void;
  updateMatchStatus: (matchId: string, status: MatchStatus) => void;
  addMatchEvent: (matchId: string, event: MatchEvent) => void;
  removeMatchEvent: (matchId: string, eventId: string) => void;
  setPlayerRating: (matchId: string, rating: PlayerRating) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  hasCompletedOnboarding: false,
  selectedRole: "organizer",
  selectedTournamentId: "lagos-summer-cup",
  followedTeamIds: ["islanders"],
  customTeams: [],
  customTournaments: [],
  matchEdits: {},
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setSelectedTournamentId: (selectedTournamentId) => set({ selectedTournamentId }),
  toggleFollowedTeam: (id) =>
    set((state) => ({
      followedTeamIds: state.followedTeamIds.includes(id)
        ? state.followedTeamIds.filter((teamId) => teamId !== id)
        : [...state.followedTeamIds, id],
    })),
  addTeam: (team) =>
    set((state) => ({ customTeams: [...state.customTeams, team] })),
  addTournament: (tournament) =>
    set((state) => ({ customTournaments: [...state.customTournaments, tournament] })),
  initMatchEdit: (match) => {
    const existing = get().matchEdits[match.id];
    if (existing) return;
    set((state) => ({
      matchEdits: {
        ...state.matchEdits,
        [match.id]: {
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          status: match.status,
          events: [...match.events],
          ratings: match.ratings ?? [],
        },
      },
    }));
  },
  updateMatchScore: (matchId, team, delta) =>
    set((state) => {
      const edit = state.matchEdits[matchId];
      if (!edit) return state;
      const key = team === "home" ? "homeScore" : "awayScore";
      return {
        matchEdits: {
          ...state.matchEdits,
          [matchId]: { ...edit, [key]: Math.max(0, edit[key] + delta) },
        },
      };
    }),
  updateMatchStatus: (matchId, status) =>
    set((state) => {
      const edit = state.matchEdits[matchId];
      if (!edit) return state;
      return { matchEdits: { ...state.matchEdits, [matchId]: { ...edit, status } } };
    }),
  addMatchEvent: (matchId, event) =>
    set((state) => {
      const edit = state.matchEdits[matchId];
      if (!edit) return state;
      const events = [...edit.events, event].sort((a, b) => a.minute - b.minute);
      return { matchEdits: { ...state.matchEdits, [matchId]: { ...edit, events } } };
    }),
  removeMatchEvent: (matchId, eventId) =>
    set((state) => {
      const edit = state.matchEdits[matchId];
      if (!edit) return state;
      return {
        matchEdits: {
          ...state.matchEdits,
          [matchId]: { ...edit, events: edit.events.filter((e) => e.id !== eventId) },
        },
      };
    }),
  setPlayerRating: (matchId, rating) =>
    set((state) => {
      const edit = state.matchEdits[matchId];
      if (!edit) return state;
      const ratings = [
        ...edit.ratings.filter((r) => r.playerId !== rating.playerId),
        rating,
      ];
      return { matchEdits: { ...state.matchEdits, [matchId]: { ...edit, ratings } } };
    }),
}));
