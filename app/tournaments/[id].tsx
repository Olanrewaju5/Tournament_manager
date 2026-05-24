import { Stack, useLocalSearchParams } from "expo-router";
import { CalendarDays, MapPin, Star, Trophy, UsersRound } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { MatchCard } from "@/components/MatchCard";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatPill } from "@/components/StatPill";
import { StandingsTable } from "@/components/StandingsTable";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tournament = repository.getTournamentById(id);
  const matches = repository.getMatchesByTournament(id);

  const teamIds = [...new Set(matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]))];
  const topScorers = teamIds
    .flatMap((tid) => repository.getPlayersByTeam(tid))
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  if (!tournament) {
    return (
      <Screen>
        <Text style={styles.title}>Tournament not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: tournament.name }} />
      <View style={[styles.hero, { borderColor: tournament.accentColor }]}>
        <Trophy color={tournament.accentColor} size={30} />
        <Text style={styles.status}>{tournament.status}</Text>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.body}>{tournament.description}</Text>
        <View style={styles.metaRow}>
          <MapPin color={colors.textMuted} size={15} />
          <Text style={styles.meta}>{tournament.venue}</Text>
        </View>
        <View style={styles.metaRow}>
          <CalendarDays color={colors.textMuted} size={15} />
          <Text style={styles.meta}>{new Date(tournament.startsAt).toDateString()}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <StatPill label="Teams" value={`${tournament.registeredTeams}/${tournament.teamLimit}`} />
        <StatPill label="Prize" value={tournament.prizePool} tone="success" />
        <StatPill label="Format" value={tournament.format} />
      </View>

      <SectionHeader title="Fixtures" action={matches.length > 0 ? `${matches.length} matches` : undefined} />
      {matches.length > 0 ? (
        <View style={styles.list}>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No fixtures yet"
          body="Fixtures will appear here once the organizer publishes the schedule."
        />
      )}

      {topScorers.length > 0 ? (
        <>
          <SectionHeader title="Top scorers" />
          <View style={styles.scorerList}>
            {topScorers.map((player, index) => {
              const team = repository.getTeamById(player.teamId);
              return (
                <View key={player.id} style={styles.scorer}>
                  <Text style={styles.scorerRank}>{index + 1}</Text>
                  <View style={styles.scorerCopy}>
                    <Text style={styles.scorerName}>{player.name}</Text>
                    <Text style={styles.scorerMeta}>{player.position} · {team?.shortName ?? "—"}</Text>
                  </View>
                  <View style={styles.scorerBadge}>
                    <Star color={colors.warning} size={14} />
                    <Text style={styles.scorerGoals}>{player.goals}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      ) : null}

      <SectionHeader title="Standings" />
      <StandingsTable tournamentId={id} />

      <SectionHeader title="Organizer notes" />
      <View style={styles.note}>
        <UsersRound color={colors.secondary} size={20} />
        <Text style={styles.noteText}>Three roster approvals are pending before the next kickoff window.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.surface,
    padding: 18,
    marginTop: 8
  },
  status: {
    color: colors.success,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 11,
    marginTop: 14,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30,
    lineHeight: 38,
    marginTop: 8
  },
  body: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 8
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12
  },
  meta: {
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 12
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  list: {
    gap: 10
  },
  scorerList: {
    gap: 8
  },
  scorer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  scorerRank: {
    width: 18,
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 13
  },
  scorerCopy: {
    flex: 1
  },
  scorerName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  scorerMeta: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 2
  },
  scorerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  scorerGoals: {
    color: colors.warning,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16
  },
  note: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  noteText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20
  }
});
