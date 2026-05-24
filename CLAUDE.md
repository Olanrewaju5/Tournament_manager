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
  index.tsx              → redirects to /onboarding or /(tabs) based on store state
  _layout.tsx            → root Stack: loads Sora fonts, guards onboarding redirect
  onboarding/index.tsx   → role selection; calls completeOnboarding() then navigates to /(tabs)
  (tabs)/
    _layout.tsx          → bottom tab bar (Home, Leagues, Table, Studio, Alerts)
    index.tsx            → role-aware home dashboard
    tournaments.tsx      → tournament list
    standings.tsx        → standings table
    graphics.tsx         → graphic template studio
    notifications.tsx    → notifications feed
  matches/[id].tsx       → match detail
  teams/[id].tsx         → team/roster detail
  tournaments/[id].tsx   → tournament detail
```

### Data layer

All data is static mock data — there is no API or backend.

- **`src/data/mock-data.ts`** — all seed data (tournaments, teams, players, matches, standings, etc.)
- **`src/lib/mock-repository.ts`** — thin query façade over mock-data; screens import `repository` and call methods like `repository.getTournamentById(id)`. Replace this layer when a real API is introduced.
- **`src/types/domain.ts`** — all domain types (`Tournament`, `Team`, `Player`, `Match`, `Standing`, `GraphicTemplate`, `NotificationItem`, `UserRole`, etc.)

### Global state (Zustand)

`src/store/app-store.ts` holds the single `useAppStore` store:

| State field | Purpose |
|---|---|
| `hasCompletedOnboarding` | guards onboarding redirect in root `_layout.tsx` |
| `selectedRole` | drives role-aware UI across screens |
| `selectedTournamentId` | the active tournament context |
| `followedTeamIds` | teams the user follows |

### UI conventions

- **`<Screen>`** (`src/components/Screen.tsx`) — wraps every screen in `SafeAreaView` + optional `ScrollView`. Props: `scroll` (default `true`), `padded` (default `true`).
- **`src/theme/colors.ts`** — single source of truth for the dark color palette. Always import from here; never hardcode hex values.
- **Sora font family** — all text uses Sora (loaded in root `_layout.tsx`). Use `fontFamily: "Sora_400Regular"` through `"Sora_800ExtraBold"`.
- Icons: `lucide-react-native`.
- Path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).
