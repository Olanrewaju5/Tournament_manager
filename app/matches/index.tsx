import { Stack } from "expo-router";
import { Activity, CalendarCheck, CheckCircle } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { MatchCard } from "@/components/MatchCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { Match } from "@/types/domain";

function groupMatches(matches: Match[]) {
  return {
    live: matches.filter((m) => m.status === "live"),
    scheduled: matches.filter((m) => m.status === "scheduled"),
    final: matches.filter((m) => m.status === "final")
  };
}

export default function MatchCenterScreen() {
  const tournaments = repository.getTournaments();
  const allMatches = tournaments.flatMap((t) => repository.getMatchesByTournament(t.id));
  const { live, scheduled, final } = groupMatches(allMatches);

  return (
    <Screen>
      <Stack.Screen options={{ title: "Match center" }} />
      <Text style={styles.title}>Match center</Text>
      <Text style={styles.body}>All fixtures across every active tournament.</Text>

      <SectionHeader title="Live now" action={live.length > 0 ? `${live.length} live` : undefined} />
      {live.length > 0 ? (
        <View style={styles.group}>
          {live.map((m) => <MatchCard key={m.id} match={m} />)}
        </View>
      ) : (
        <EmptyState icon={Activity} title="Nothing live right now" body="Live matches will appear here as they kick off." />
      )}

      <SectionHeader title="Upcoming" />
      {scheduled.length > 0 ? (
        <View style={styles.group}>
          {scheduled.map((m) => {
            const t = repository.getTournamentById(m.tournamentId);
            return (
              <View key={m.id}>
                {t ? <Text style={styles.tournamentTag}>{t.name} · {m.round}</Text> : null}
                <MatchCard match={m} />
              </View>
            );
          })}
        </View>
      ) : (
        <EmptyState icon={CalendarCheck} title="No upcoming fixtures" body="Scheduled matches will appear here once published." />
      )}

      <SectionHeader title="Results" action={final.length > 0 ? `${final.length} played` : undefined} />
      {final.length > 0 ? (
        <View style={styles.group}>
          {final.map((m) => <MatchCard key={m.id} match={m} />)}
        </View>
      ) : (
        <EmptyState icon={CheckCircle} title="No results yet" body="Completed match results will show here." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30,
    marginTop: 8
  },
  body: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8
  },
  group: {
    gap: 10
  },
  tournamentTag: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 6
  }
});
