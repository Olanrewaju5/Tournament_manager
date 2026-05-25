import { create } from "zustand";
import { Team, Tournament, UserRole } from "@/types/domain";

type AppState = {
  hasCompletedOnboarding: boolean;
  selectedRole: UserRole;
  selectedTournamentId: string;
  followedTeamIds: string[];
  customTeams: Team[];
  customTournaments: Tournament[];
  completeOnboarding: () => void;
  setSelectedRole: (role: UserRole) => void;
  setSelectedTournamentId: (id: string) => void;
  toggleFollowedTeam: (id: string) => void;
  addTeam: (team: Team) => void;
  addTournament: (tournament: Tournament) => void;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  selectedRole: "organizer",
  selectedTournamentId: "lagos-summer-cup",
  followedTeamIds: ["islanders"],
  customTeams: [],
  customTournaments: [],
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setSelectedTournamentId: (selectedTournamentId) => set({ selectedTournamentId }),
  toggleFollowedTeam: (id) =>
    set((state) => ({
      followedTeamIds: state.followedTeamIds.includes(id)
        ? state.followedTeamIds.filter((teamId) => teamId !== id)
        : [...state.followedTeamIds, id]
    })),
  addTeam: (team) =>
    set((state) => ({ customTeams: [...state.customTeams, team] })),
  addTournament: (tournament) =>
    set((state) => ({ customTournaments: [...state.customTournaments, tournament] })),
}));
