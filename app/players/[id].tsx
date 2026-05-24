import { router, Stack, useLocalSearchParams } from "expo-router";
import { Award, Star } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatPill } from "@/components/StatPill";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const player = repository.getPlayerById(id);

  if (!player) {
    return (
      <Screen>
        <Text style={styles.notFound}>Player not found</Text>
      </Screen>
    );
  }

  const team = repository.getTeamById(player.teamId);

  return (
    <Screen>
      <Stack.Screen options={{ title: player.name }} />

      <LinearGradient
        colors={team ? [team.colors[0], "#0B0B0F"] : ["#2563FF", "#0B0B0F"]}
        style={styles.hero}
      >
        <View style={styles.jerseyBadge}>
          <Text style={styles.jerseyNumber}>{player.jerseyNumber}</Text>
        </View>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.position}>{player.position}</Text>
        {team ? (
          <View style={styles.teamRow}>
            <TeamBadge team={team} size="sm" />
            <Text style={styles.teamName}>{team.name}</Text>
          </View>
        ) : null}
      </LinearGradient>

      <View style={styles.stats}>
        <StatPill label="Goals" value={player.goals} tone="success" />
        <StatPill label="Assists" value={player.assists} />
        <StatPill label="G+A" value={player.goals + player.assists} tone="warning" />
      </View>

      {player.awards.length > 0 ? (
        <>
          <SectionHeader title="Awards" />
          <View style={styles.awardList}>
            {player.awards.map((award, index) => (
              <View key={index} style={styles.awardRow}>
                <View style={styles.awardIcon}>
                  <Star color={colors.warning} size={18} />
                </View>
                <Text style={styles.awardLabel}>{award}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <SectionHeader title="Season summary" />
      <View style={styles.summaryCard}>
        <SummaryRow label="Position" value={player.position} />
        <View style={styles.divider} />
        <SummaryRow label="Jersey number" value={`#${player.jerseyNumber}`} />
        <View style={styles.divider} />
        <SummaryRow label="Goals" value={String(player.goals)} />
        <View style={styles.divider} />
        <SummaryRow label="Assists" value={String(player.assists)} />
        <View style={styles.divider} />
        <SummaryRow label="Goal contributions" value={String(player.goals + player.assists)} />
      </View>

      {team ? (
        <PrimaryButton
          label={`View ${team.shortName} roster`}
          variant="secondary"
          icon={<Award color={colors.text} size={17} />}
          style={styles.teamBtn}
          onPress={() => router.push(`/teams/${team.id}`)}
        />
      ) : null}
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 22,
    marginTop: 8
  },
  hero: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginTop: 8,
    alignItems: "center",
    gap: 10
  },
  jerseyBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },
  jerseyNumber: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30
  },
  name: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 26,
    textAlign: "center"
  },
  position: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: "Sora_600SemiBold",
    fontSize: 13
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4
  },
  teamName: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  awardList: {
    gap: 8
  },
  awardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  awardIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: `${colors.warning}22`,
    alignItems: "center",
    justifyContent: "center"
  },
  awardLabel: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  summaryCard: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  divider: {
    height: 1,
    backgroundColor: colors.border
  },
  summaryLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 13
  },
  summaryValue: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  teamBtn: {
    marginTop: 18
  }
});
