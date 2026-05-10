import { StyleSheet, Text, View } from "react-native";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { TeamBadge } from "@/components/TeamBadge";

export function StandingsTable() {
  const standings = repository.getStandings();

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.head, styles.teamHead]}>Team</Text>
        <Text style={styles.head}>P</Text>
        <Text style={styles.head}>W</Text>
        <Text style={styles.head}>D</Text>
        <Text style={styles.head}>L</Text>
        <Text style={styles.head}>GD</Text>
        <Text style={styles.head}>PTS</Text>
      </View>
      {standings.map((standing, index) => {
        const team = repository.getTeamById(standing.teamId);
        if (!team) return null;

        return (
          <View key={standing.teamId} style={[styles.row, index === 0 && styles.topRow]}>
            <View style={styles.teamCell}>
              <Text style={styles.rank}>{index + 1}</Text>
              <TeamBadge team={team} size="sm" />
              <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
            </View>
            <Text style={styles.cell}>{standing.played}</Text>
            <Text style={styles.cell}>{standing.wins}</Text>
            <Text style={styles.cell}>{standing.draws}</Text>
            <Text style={styles.cell}>{standing.losses}</Text>
            <Text style={styles.cell}>{standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}</Text>
            <Text style={[styles.cell, styles.points]}>{standing.points}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surfaceElevated
  },
  head: {
    width: 34,
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 10,
    textAlign: "center"
  },
  teamHead: {
    flex: 1,
    textAlign: "left"
  },
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  topRow: {
    backgroundColor: "#112435"
  },
  teamCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0
  },
  rank: {
    width: 16,
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 12
  },
  teamName: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 12
  },
  cell: {
    width: 34,
    color: colors.text,
    fontFamily: "Sora_500Medium",
    fontSize: 12,
    textAlign: "center"
  },
  points: {
    fontFamily: "Sora_800ExtraBold"
  }
});
