import {
  GraphicTemplate,
  Match,
  NotificationItem,
  Player,
  Standing,
  Team,
  Tournament
} from "@/types/domain";

export const tournaments: Tournament[] = [
  {
    id: "lagos-summer-cup",
    name: "Lagos Summer Cup",
    sport: "Football",
    format: "league",
    status: "live",
    venue: "Campos Mini Stadium",
    organizer: "Mainland Sports Collective",
    startsAt: "2026-05-16T16:00:00Z",
    registrationDeadline: "2026-05-12T18:00:00Z",
    teamLimit: 12,
    registeredTeams: 10,
    prizePool: "₦1.2M",
    sponsor: "BlueVolt Energy",
    accentColor: "#2563FF",
    description: "A fast weekend league for Lagos community clubs, built around live scores and social-ready match graphics."
  },
  {
    id: "ikorodu-hoops",
    name: "Ikorodu Hoops Night",
    sport: "Basketball",
    format: "knockout",
    status: "registration",
    venue: "Rowe Park",
    organizer: "Hoop Yard",
    startsAt: "2026-05-30T18:30:00Z",
    registrationDeadline: "2026-05-20T18:00:00Z",
    teamLimit: 8,
    registeredTeams: 5,
    prizePool: "₦500K",
    sponsor: "CourtSide Grill",
    accentColor: "#00C2FF",
    description: "Night-time knockout basketball with quick approvals, player spotlights, and award posters."
  }
];

export const teams: Team[] = [
  {
    id: "islanders",
    name: "Islanders FC",
    shortName: "ISL",
    city: "Lagos Island",
    colors: ["#2563FF", "#00C2FF"],
    captain: "Tomi Adewale",
    bio: "Possession-heavy local champions with a loud traveling fan base.",
    wins: 4,
    draws: 1,
    losses: 0,
    goalsFor: 13,
    goalsAgainst: 4
  },
  {
    id: "mainland",
    name: "Mainland Stars",
    shortName: "MNS",
    city: "Yaba",
    colors: ["#22C55E", "#EAB308"],
    captain: "Femi Rhodes",
    bio: "High-pressing side with a young midfield and quick transitions.",
    wins: 3,
    draws: 1,
    losses: 1,
    goalsFor: 10,
    goalsAgainst: 6
  },
  {
    id: "surulere",
    name: "Surulere Athletic",
    shortName: "SUA",
    city: "Surulere",
    colors: ["#F97316", "#FFFFFF"],
    captain: "Jude Okorie",
    bio: "Set-piece specialists with a physical back line.",
    wins: 3,
    draws: 0,
    losses: 2,
    goalsFor: 9,
    goalsAgainst: 7
  },
  {
    id: "lekki",
    name: "Lekki Rangers",
    shortName: "LKR",
    city: "Lekki",
    colors: ["#A855F7", "#22D3EE"],
    captain: "David King",
    bio: "Technical team that leans on wide overloads and late runs.",
    wins: 2,
    draws: 2,
    losses: 1,
    goalsFor: 8,
    goalsAgainst: 7
  },
  {
    id: "hoop-kings",
    name: "Hoop Yard Kings",
    shortName: "HYK",
    city: "Ikorodu",
    colors: ["#00C2FF", "#0B0B0F"],
    captain: "Emeka Eze",
    bio: "Explosive backcourt unit with elite three-point shooting and relentless defensive pressure.",
    wins: 2,
    draws: 0,
    losses: 1,
    goalsFor: 198,
    goalsAgainst: 165
  },
  {
    id: "rowe-ballers",
    name: "Rowe Ballers",
    shortName: "RWB",
    city: "Ikorodu",
    colors: ["#A855F7", "#F97316"],
    captain: "Seun Adeyemi",
    bio: "Paint-dominant squad built around interior scoring and team-first defense.",
    wins: 1,
    draws: 0,
    losses: 2,
    goalsFor: 170,
    goalsAgainst: 188
  }
];

export const players: Player[] = [
  { id: "p1", teamId: "islanders", name: "Tomi Adewale", position: "Forward", jerseyNumber: 9, goals: 6, assists: 2, awards: ["MVP x2"] },
  { id: "p2", teamId: "islanders", name: "Seyi Cole", position: "Midfielder", jerseyNumber: 8, goals: 2, assists: 5, awards: [] },
  { id: "p3", teamId: "islanders", name: "Victor James", position: "Goalkeeper", jerseyNumber: 1, goals: 0, assists: 0, awards: ["Clean Sheet"] },
  { id: "p4", teamId: "mainland", name: "Femi Rhodes", position: "Midfielder", jerseyNumber: 10, goals: 4, assists: 3, awards: ["Captain"] },
  { id: "p5", teamId: "mainland", name: "Kola Briggs", position: "Forward", jerseyNumber: 11, goals: 5, assists: 1, awards: [] },
  { id: "p6", teamId: "surulere", name: "Jude Okorie", position: "Defender", jerseyNumber: 5, goals: 1, assists: 0, awards: ["Fair Play"] },
  { id: "p7", teamId: "lekki", name: "David King", position: "Winger", jerseyNumber: 7, goals: 3, assists: 4, awards: [] },
  { id: "p8", teamId: "hoop-kings", name: "Emeka Eze", position: "Guard", jerseyNumber: 3, goals: 22, assists: 8, awards: ["Top Scorer"] },
  { id: "p9", teamId: "hoop-kings", name: "Chidi Obi", position: "Forward", jerseyNumber: 7, goals: 18, assists: 4, awards: [] },
  { id: "p10", teamId: "hoop-kings", name: "Kola Nwosu", position: "Center", jerseyNumber: 11, goals: 12, assists: 2, awards: [] },
  { id: "p11", teamId: "rowe-ballers", name: "Seun Adeyemi", position: "Center", jerseyNumber: 5, goals: 20, assists: 3, awards: ["Captain"] },
  { id: "p12", teamId: "rowe-ballers", name: "Tunde Bello", position: "Guard", jerseyNumber: 2, goals: 14, assists: 9, awards: [] },
  { id: "p13", teamId: "rowe-ballers", name: "Ayo Martins", position: "Forward", jerseyNumber: 8, goals: 10, assists: 5, awards: [] }
];

export const matches: Match[] = [
  {
    id: "match-live",
    tournamentId: "lagos-summer-cup",
    homeTeamId: "islanders",
    awayTeamId: "mainland",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    startsAt: "2026-05-10T16:00:00Z",
    venue: "Campos Pitch A",
    timer: "68:14",
    round: "Matchday 5",
    events: [
      { id: "e1", minute: 12, type: "goal", teamId: "islanders", playerName: "Tomi Adewale", note: "Low finish after a quick one-two." },
      { id: "e2", minute: 38, type: "goal", teamId: "mainland", playerName: "Kola Briggs", note: "Header from the back post." },
      { id: "e3", minute: 61, type: "goal", teamId: "islanders", playerName: "Seyi Cole", note: "Curled shot from the edge." },
      { id: "e4", minute: 66, type: "card", teamId: "mainland", playerName: "Femi Rhodes", note: "Late challenge in midfield." }
    ]
  },
  {
    id: "match-next",
    tournamentId: "lagos-summer-cup",
    homeTeamId: "surulere",
    awayTeamId: "lekki",
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    startsAt: "2026-05-10T18:30:00Z",
    venue: "Campos Pitch B",
    round: "Matchday 5",
    events: []
  },
  {
    id: "match-hoops-q1",
    tournamentId: "ikorodu-hoops",
    homeTeamId: "hoop-kings",
    awayTeamId: "rowe-ballers",
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    startsAt: "2026-05-30T18:30:00Z",
    venue: "Rowe Park Court A",
    round: "Quarter Final",
    events: []
  },
  {
    id: "match-final",
    tournamentId: "lagos-summer-cup",
    homeTeamId: "islanders",
    awayTeamId: "surulere",
    homeScore: 3,
    awayScore: 0,
    status: "final",
    startsAt: "2026-05-09T17:00:00Z",
    venue: "Campos Pitch A",
    round: "Matchday 4",
    events: [
      { id: "e5", minute: 9, type: "goal", teamId: "islanders", playerName: "Tomi Adewale", note: "Opened the scoring from close range." }
    ]
  }
];

export const standings: Standing[] = [
  { tournamentId: "lagos-summer-cup", teamId: "islanders", played: 5, wins: 4, draws: 1, losses: 0, goalDifference: 9, points: 13, movement: "up" },
  { tournamentId: "lagos-summer-cup", teamId: "mainland", played: 5, wins: 3, draws: 1, losses: 1, goalDifference: 4, points: 10, movement: "same" },
  { tournamentId: "lagos-summer-cup", teamId: "surulere", played: 5, wins: 3, draws: 0, losses: 2, goalDifference: 2, points: 9, movement: "down" },
  { tournamentId: "lagos-summer-cup", teamId: "lekki", played: 5, wins: 2, draws: 2, losses: 1, goalDifference: 1, points: 8, movement: "up" },
  { tournamentId: "ikorodu-hoops", teamId: "hoop-kings", played: 3, wins: 2, draws: 0, losses: 1, goalDifference: 33, points: 6, movement: "up" },
  { tournamentId: "ikorodu-hoops", teamId: "rowe-ballers", played: 3, wins: 1, draws: 0, losses: 2, goalDifference: -33, points: 3, movement: "down" }
];

export const graphicTemplates: GraphicTemplate[] = [
  {
    id: "score-blast",
    title: "Score Blast",
    type: "scorecard",
    ratio: "1:1",
    exportTargets: ["PNG", "Instagram"],
    description: "Bold final score card with team colors and sponsor lockup."
  },
  {
    id: "fixture-night",
    title: "Fixture Night",
    type: "fixtures",
    ratio: "9:16",
    exportTargets: ["PNG", "Story"],
    description: "Vertical match poster for WhatsApp and Instagram stories."
  },
  {
    id: "mvp-crown",
    title: "MVP Crown",
    type: "award",
    ratio: "4:5",
    exportTargets: ["PNG", "PDF"],
    description: "Player award graphic for matchday recognition."
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Team approval pending",
    body: "Lekki Rangers submitted final roster changes.",
    tone: "warning",
    createdAt: "8 min ago"
  },
  {
    id: "n2",
    title: "Match is live",
    body: "Islanders FC lead Mainland Stars 2-1 at 68 minutes.",
    tone: "success",
    createdAt: "Now"
  },
  {
    id: "n3",
    title: "Graphic ready",
    body: "Score Blast template is ready for the last result.",
    tone: "info",
    createdAt: "24 min ago"
  }
];
