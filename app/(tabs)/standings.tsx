import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { colors } from "@/theme/colors";

export default function StandingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>League table</Text>
      <Text style={styles.body}>Dense enough for organizers, clean enough for every fan on matchday.</Text>
      <SectionHeader title="Lagos Summer Cup" action="Matchday 5" />
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
