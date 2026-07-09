export type UserRole = "organizer" | "team-manager" | "player" | "spectator";

export type TournamentFormat =
  | "league"
  | "knockout"
  | "round-robin"
  | "group-stage"
  | "hybrid"
  | "double-elimination";

export type TournamentStatus = "draft" | "registration" | "live" | "completed";

export type Tournament = {
  id: string;
  name: string;
  sport: string;
  format: TournamentFormat;
  status: TournamentStatus;
  venue: string;
  organizer: string;
  startsAt: string;
  registrationDeadline: string;
  teamLimit: number;
  registeredTeams: number;
  prizePool: string;
  sponsor: string;
  accentColor: string;
  description: string;
};

export type Team = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: [string, string];
  captain: string;
  bio: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  position: string;
  jerseyNumber: number;
  goals: number;
  assists: number;
  awards: string[];
};

export type MatchEventType = "goal" | "card" | "substitution" | "commentary";
export type CardColor = "yellow" | "red";

export type MatchEvent = {
  id: string;
  minute: number;
  type: MatchEventType;
  teamId?: string;
  playerName?: string;
  note: string;
  cardColor?: CardColor;
};

export type PlayerRating = {
  playerId: string;
  playerName: string;
  teamId: string;
  rating: number; // 1–10
  note?: string;
};

export type MatchStatus = "scheduled" | "live" | "final";

export type Match = {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startsAt: string;
  venue: string;
  timer?: string;
  round: string;
  events: MatchEvent[];
  ratings?: PlayerRating[];
};

export type Standing = {
  tournamentId: string;
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  points: number;
  movement: "up" | "down" | "same";
};

export type GraphicTemplate = {
  id: string;
  title: string;
  type: "scorecard" | "fixtures" | "award" | "winner";
  ratio: string;
  exportTargets: string[];
  description: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning";
  createdAt: string;
};

export type BracketSlot = {
  teamId: string | null;
  score: number | null;
  winner: boolean;
};

export type BracketMatch = {
  id: string;
  matchId?: string;
  home: BracketSlot;
  away: BracketSlot;
  label?: string;
  scheduledDate?: string;
};

export type BracketRound = {
  id: string;
  name: string;
  shortName: string;
  matches: BracketMatch[];
};

export type Bracket = {
  tournamentId: string;
  rounds: BracketRound[];
};
