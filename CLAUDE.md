# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start        # start Expo dev server (scan QR with Expo Go)
npm run ios          # run on iOS simulator
npm run android      # run on Android emulator
npm run web          # run in browser
npm run typecheck    # TypeScript check (no emit)
```

There is no lint or test script configured.

## Architecture

**Tournamentos** is an Expo / React Native app for managing amateur sports tournaments. It targets organizers, team managers, players, and spectators via a role-based home screen.

### Routing (Expo Router file-based)

```
app/
  index.tsx                → redirects to /onboarding or /(tabs) based on store state
  _layout.tsx              → root Stack: loads Sora fonts, guards onboarding redirect
  onboarding/index.tsx     → role selection; calls completeOnboarding() then navigates to /(tabs)
  profile.tsx              → role switcher + followed teams management
  (tabs)/
    _layout.tsx            → bottom tab bar (Home, Leagues, Table, Studio, Alerts)
    index.tsx              → role-aware home dashboard
    tournaments.tsx        → tournament list
    standings.tsx          → standings table
    graphics.tsx           → graphic template studio
    notifications.tsx      → notifications feed
  matches/index.tsx        → match centre (all fixtures grouped: live / upcoming / results)
  matches/[id]/index.tsx   → match detail with live score editor, events, and player ratings
  teams/[id].tsx           → team roster detail; follow/unfollow button
  teams/new.tsx            → create team form
  tournaments/[id].tsx     → tournament detail
  tournaments/new.tsx      → create tournament form
  players/[id].tsx         → player profile
  graphics/[id].tsx        → graphic template detail / export
```

### Data layer

All data is static mock data — there is no API or backend.

- **`src/data/mock-data.ts`** — all seed data (tournaments, teams, players, matches, standings, etc.)
- **`src/lib/mock-repository.ts`** — thin query façade over mock-data **plus** Zustand store state. Screens always call `repository.*` rather than importing mock-data directly, so swapping in a real API only requires changing this file. `applyMatchEdit()` merges live edits from the store on top of base match data.
- **`src/types/domain.ts`** — all domain types (`Tournament`, `Team`, `Player`, `Match`, `MatchEvent`, `PlayerRating`, `Standing`, `GraphicTemplate`, `NotificationItem`, `UserRole`, etc.)

### Global state (Zustand)

`src/store/app-store.ts` — single `useAppStore` store (no persistence/hydration):

| State field | Purpose |
|---|---|
| `hasCompletedOnboarding` | guards onboarding redirect in root `_layout.tsx` |
| `selectedRole` | drives role-aware UI across all screens |
| `selectedTournamentId` | the active tournament context |
| `followedTeamIds` | teams the user follows |
| `customTeams / customTournaments / customMatches / customPlayers` | user-created records merged into repository queries |
| `matchEdits` | live per-match edits (score, status, events, ratings) keyed by match ID |

Match editing flow: call `initMatchEdit(match)` once to seed the edit state from base data, then use `updateMatchScore`, `updateMatchStatus`, `addMatchEvent`, `removeMatchEvent`, and `setPlayerRating` to mutate. The repository's `applyMatchEdit()` overlays these edits at read time.

### UI conventions

- **`<Screen>`** (`src/components/Screen.tsx`) — wraps every screen in `SafeAreaView` + optional `ScrollView`. Props: `scroll` (default `true`), `padded` (default `true`).
- **`src/theme/colors.ts`** — single source of truth for the dark color palette. Always import from here; never hardcode hex values.
- **Sora font family** — all text uses Sora (loaded in root `_layout.tsx`). Available weights: `Sora_400Regular`, `Sora_500Medium`, `Sora_600SemiBold`, `Sora_700Bold`, `Sora_800ExtraBold`.
- Icons: `lucide-react-native`.
- Path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).
- All styles use `StyleSheet.create`; no style props inline.
