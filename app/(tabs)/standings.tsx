import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

export default function StandingsScreen() {
  const selectedTournamentId = useAppStore((state) => state.selectedTournamentId);
  const setSelectedTournamentId = useAppStore((state) => state.setSelectedTournamentId);
  const tournament = repository.getTournamentById(selectedTournamentId);
  const tournaments = repository.getTournaments();
  const matches = repository.getMatchesByTournament(selectedTournamentId);
  const latestRound = matches.filter((m) => m.status !== "scheduled").at(-1)?.round;

  return (
    <Screen>
      <Text style={styles.title}>League table</Text>
      <Text style={styles.body}>Dense enough for organizers, clean enough for every fan on matchday.</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
        style={styles.pillScroll}
      >
        {tournaments.map((t) => {
          const selected = t.id === selectedTournamentId;
          return (
            <Pressable
              key={t.id}
              style={[styles.pill, selected && styles.pillSelected]}
              onPress={() => setSelectedTournamentId(t.id)}
            >
              <View style={[styles.pillDot, { backgroundColor: t.accentColor }]} />
              <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]}>
                {t.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader title={tournament?.name ?? "Standings"} action={latestRound} />
      <StandingsTable tournamentId={selectedTournamentId} />
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
  pillScroll: {
    marginTop: 16
  },
  pillRow: {
    gap: 8,
    paddingBottom: 4
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  pillSelected: {
    borderColor: colors.secondary,
    backgroundColor: "#112435"
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  pillLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  pillLabelSelected: {
    color: colors.text
  }
});
