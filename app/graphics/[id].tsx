import { Stack, useLocalSearchParams } from "expo-router";
import { Download, Share2 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { GraphicTemplate } from "@/types/domain";

function ScorecardPreview() {
  const match = repository.getLiveMatch();
  const home = match ? repository.getTeamById(match.homeTeamId) : null;
  const away = match ? repository.getTeamById(match.awayTeamId) : null;

  return (
    <LinearGradient colors={["#13213F", "#0B0B0F"]} style={styles.previewSquare}>
      <Text style={styles.previewKicker}>Lagos Summer Cup · Matchday 5</Text>
      {match && home && away ? (
        <View style={styles.scorecardInner}>
          <View style={styles.scorecardTeam}>
            <TeamBadge team={home} size="lg" />
            <Text style={styles.scorecardShort}>{home.shortName}</Text>
          </View>
          <View style={styles.scorecardCenter}>
            <Text style={styles.scorecardScore}>{match.homeScore}:{match.awayScore}</Text>
            <Text style={styles.scorecardTimer}>{match.timer} LIVE</Text>
          </View>
          <View style={styles.scorecardTeam}>
            <TeamBadge team={away} size="lg" />
            <Text style={styles.scorecardShort}>{away.shortName}</Text>
          </View>
        </View>
      ) : null}
      <Text style={styles.previewSponsor}>BlueVolt Energy</Text>
    </LinearGradient>
  );
}

function FixturePreview() {
  const matches = repository.getMatchesByTournament("lagos-summer-cup");
  const upcoming = matches.filter((m) => m.status !== "final").slice(0, 3);

  return (
    <LinearGradient colors={["#0B0B0F", "#2563FF18"]} style={styles.previewVertical}>
      <Text style={styles.previewKicker}>Matchday 5 · Fixtures</Text>
      <Text style={styles.fixtureHeadline}>Who's playing next?</Text>
      <View style={styles.fixtureList}>
        {upcoming.map((match) => {
          const home = repository.getTeamById(match.homeTeamId);
          const away = repository.getTeamById(match.awayTeamId);
          if (!home || !away) return null;
          return (
            <View key={match.id} style={styles.fixtureRow}>
              <Text style={styles.fixtureTeam}>{home.shortName}</Text>
              <View style={styles.fixtureVsBadge}>
                <Text style={styles.fixtureVs}>VS</Text>
              </View>
              <Text style={styles.fixtureTeam}>{away.shortName}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.previewSponsor}>Lagos Summer Cup 2026</Text>
    </LinearGradient>
  );
}

function AwardPreview() {
  const players = repository.getPlayersByTeam("islanders");
  const mvp = players.find((p) => p.awards.length > 0) ?? players[0];

  return (
    <LinearGradient colors={["#F97316", "#0B0B0F"]} style={styles.previewPortrait}>
      <Text style={styles.awardLabel}>Player of the Match</Text>
      <View style={styles.awardNumberBadge}>
        <Text style={styles.awardNumber}>{mvp?.jerseyNumber}</Text>
      </View>
      <Text style={styles.awardName}>{mvp?.name ?? "—"}</Text>
      <Text style={styles.awardPosition}>{mvp?.position}</Text>
      <View style={styles.awardStats}>
        <Text style={styles.awardStat}>{mvp?.goals ?? 0} goals</Text>
        <Text style={styles.awardStatSep}>·</Text>
        <Text style={styles.awardStat}>{mvp?.assists ?? 0} assists</Text>
      </View>
    </LinearGradient>
  );
}

function WinnerPreview() {
  const team = repository.getTeamById("islanders");

  return (
    <LinearGradient colors={["#2563FF", "#0B0B0F"]} style={styles.previewPortrait}>
      <Text style={styles.awardLabel}>Tournament Champions</Text>
      {team ? <TeamBadge team={team} size="lg" /> : null}
      <Text style={styles.awardName}>{team?.name ?? "—"}</Text>
      <Text style={styles.awardPosition}>{team?.city}</Text>
      <Text style={styles.awardStat}>Lagos Summer Cup 2026</Text>
    </LinearGradient>
  );
}

const PREVIEWS: Record<GraphicTemplate["type"], React.FC> = {
  scorecard: ScorecardPreview,
  fixtures: FixturePreview,
  award: AwardPreview,
  winner: WinnerPreview
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export default function GraphicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = repository.getGraphicTemplates().find((t) => t.id === id);

  if (!template) {
    return (
      <Screen>
        <Text style={styles.notFound}>Template not found</Text>
      </Screen>
    );
  }

  const Preview = PREVIEWS[template.type] ?? ScorecardPreview;

  return (
    <Screen>
      <Stack.Screen options={{ title: template.title }} />
      <Preview />

      <SectionHeader title="Template details" />
      <View style={styles.metaCard}>
        <MetaRow label="Type" value={template.type} />
        <View style={styles.metaDivider} />
        <MetaRow label="Aspect ratio" value={template.ratio} />
        <View style={styles.metaDivider} />
        <MetaRow label="Export targets" value={template.exportTargets.join(" · ")} />
      </View>
      <Text style={styles.description}>{template.description}</Text>

      <PrimaryButton
        label="Export graphic"
        icon={<Download color={colors.text} size={18} />}
        style={styles.cta}
      />
      <PrimaryButton
        label="Share"
        variant="secondary"
        icon={<Share2 color={colors.text} size={18} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 22,
    marginTop: 8
  },
  // Scorecard (1:1 square)
  previewSquare: {
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginTop: 8,
    justifyContent: "space-between"
  },
  scorecardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  scorecardTeam: {
    flex: 1,
    alignItems: "center",
    gap: 10
  },
  scorecardShort: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16
  },
  scorecardCenter: {
    alignItems: "center",
    gap: 6
  },
  scorecardScore: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 44
  },
  scorecardTimer: {
    color: colors.success,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 11,
    textTransform: "uppercase"
  },
  // Fixture (9:16 vertical)
  previewVertical: {
    aspectRatio: 9 / 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    padding: 20,
    justifyContent: "space-between",
    alignSelf: "center",
    width: "62%"
  },
  fixtureHeadline: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 22,
    lineHeight: 28
  },
  fixtureList: {
    gap: 12
  },
  fixtureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  fixtureTeam: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16,
    flex: 1,
    textAlign: "center"
  },
  fixtureVsBadge: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  fixtureVs: {
    color: colors.textSubtle,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 10
  },
  // Award / Winner (4:5 portrait)
  previewPortrait: {
    aspectRatio: 4 / 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    padding: 24,
    justifyContent: "flex-end",
    gap: 8
  },
  awardLabel: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Sora_700Bold",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8
  },
  awardNumberBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  awardNumber: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 26
  },
  awardName: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 26,
    lineHeight: 32
  },
  awardPosition: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Sora_500Medium",
    fontSize: 13
  },
  awardStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4
  },
  awardStat: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  awardStatSep: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  // Shared preview text
  previewKicker: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 10,
    textTransform: "uppercase"
  },
  previewSponsor: {
    color: "rgba(255,255,255,0.38)",
    fontFamily: "Sora_700Bold",
    fontSize: 10
  },
  // Meta card
  metaCard: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.border
  },
  metaLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 13
  },
  metaValue: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 13,
    textTransform: "capitalize"
  },
  description: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 14,
    marginBottom: 18
  },
  cta: {
    marginBottom: 10
  }
});
