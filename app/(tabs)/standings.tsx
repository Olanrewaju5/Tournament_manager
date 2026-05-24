import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

export default function StandingsScreen() {
  const selectedTournamentId = useAppStore((state) => state.selectedTournamentId);
  const tournament = repository.getTournamentById(selectedTournamentId);
  const matches = repository.getMatchesByTournament(selectedTournamentId);
  const latestRound = matches.filter((m) => m.status !== "scheduled").at(-1)?.round;

  return (
    <Screen>
      <Text style={styles.title}>League table</Text>
      <Text style={styles.body}>Dense enough for organizers, clean enough for every fan on matchday.</Text>
      <SectionHeader title={tournament?.name ?? "Standings"} action={latestRound} />
      <StandingsTable />
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
  }
});
