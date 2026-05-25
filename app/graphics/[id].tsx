import { Stack, useLocalSearchParams } from "expo-router";
import { Check, Download, EyeOff, Share2, Type, Users } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { GraphicTemplate } from "@/types/domain";

// ─── Themes ──────────────────────────────────────────────────────────────────
type Theme = {
  id: string;
  label: string;
  bg1: string;
  bg2: string;
  accent: string;
};

const THEMES: Theme[] = [
  { id: "ocean",   label: "Ocean",   bg1: "#0D1F3F", bg2: "#0B0B0F", accent: "#2563FF" },
  { id: "night",   label: "Night",   bg1: "#0B0B0F", bg2: "#1A1A2E", accent: "#00C2FF" },
  { id: "forest",  label: "Forest",  bg1: "#0A2218", bg2: "#0B0B0F", accent: "#22C55E" },
  { id: "sunset",  label: "Sunset",  bg1: "#2A1208", bg2: "#0B0B0F", accent: "#F97316" },
  { id: "fire",    label: "Fire",    bg1: "#2A0808", bg2: "#0B0B0F", accent: "#EF4444" },
  { id: "purple",  label: "Purple",  bg1: "#180A2E", bg2: "#0B0B0F", accent: "#A855F7" },
  { id: "gold",    label: "Gold",    bg1: "#221A08", bg2: "#0B0B0F", accent: "#EAB308" },
  { id: "rose",    label: "Rose",    bg1: "#280A18", bg2: "#0B0B0F", accent: "#EC4899" },
];

type BgStyle = "gradient" | "flat" | "split";

type GraphicConfig = {
  theme: Theme;
  bgStyle: BgStyle;
  showSponsor: boolean;
  showBadges: boolean;
  boldText: boolean;
};

// ─── Preview components ───────────────────────────────────────────────────────
function PreviewBackground({
  config, style, children,
}: { config: GraphicConfig; style: object; children: React.ReactNode }) {
  if (config.bgStyle === "flat") {
    return <View style={[style, { backgroundColor: config.theme.bg1 }]}>{children}</View>;
  }
  if (config.bgStyle === "split") {
    return (
      <View style={[style, { backgroundColor: config.theme.bg2, overflow: "hidden" }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: config.theme.bg1, height: "50%" }]} />
        {children}
      </View>
    );
  }
  return (
    <LinearGradient colors={[config.theme.bg1, config.theme.bg2]} style={style}>
      {children}
    </LinearGradient>
  );
}

function ScorecardPreview({ config }: { config: GraphicConfig }) {
  const match = repository.getLiveMatch();
  const home = match ? repository.getTeamById(match.homeTeamId) : null;
  const away = match ? repository.getTeamById(match.awayTeamId) : null;
  const nameStyle = config.boldText ? styles.scorecardShortBold : styles.scorecardShort;

  return (
    <PreviewBackground config={config} style={styles.previewSquare}>
      <Text style={[styles.previewKicker, { color: config.theme.accent }]}>
        Lagos Summer Cup · Matchday 5
      </Text>
      {match && home && away ? (
        <View style={styles.scorecardInner}>
          <View style={styles.scorecardTeam}>
            {config.showBadges && <TeamBadge team={home} size="lg" />}
            <Text style={nameStyle}>{home.shortName}</Text>
          </View>
          <View style={styles.scorecardCenter}>
            <Text style={styles.scorecardScore}>
              {match.homeScore}:{match.awayScore}
            </Text>
            <Text style={[styles.scorecardTimer, { color: colors.success }]}>
              {match.timer} LIVE
            </Text>
          </View>
          <View style={styles.scorecardTeam}>
            {config.showBadges && <TeamBadge team={away} size="lg" />}
            <Text style={nameStyle}>{away.shortName}</Text>
          </View>
        </View>
      ) : null}
      {config.showSponsor && (
        <Text style={styles.previewSponsor}>BlueVolt Energy</Text>
      )}
    </PreviewBackground>
  );
}

function FixturePreview({ config }: { config: GraphicConfig }) {
  const matches = repository.getMatchesByTournament("lagos-summer-cup");
  const upcoming = matches.filter((m) => m.status !== "final").slice(0, 3);

  return (
    <PreviewBackground config={config} style={styles.previewVertical}>
      <Text style={[styles.previewKicker, { color: config.theme.accent }]}>
        Matchday 5 · Fixtures
      </Text>
      <Text style={[styles.fixtureHeadline, config.boldText && { fontFamily: "Sora_800ExtraBold" }]}>
        Who's playing next?
      </Text>
      <View style={styles.fixtureList}>
        {upcoming.map((match) => {
          const home = repository.getTeamById(match.homeTeamId);
          const away = repository.getTeamById(match.awayTeamId);
          if (!home || !away) return null;
          return (
            <View key={match.id} style={styles.fixtureRow}>
              {config.showBadges && <TeamBadge team={home} size="sm" />}
              <Text style={styles.fixtureTeam} numberOfLines={1}>{home.shortName}</Text>
              <View style={[styles.fixtureVsBadge, { backgroundColor: config.theme.accent + "22" }]}>
                <Text style={[styles.fixtureVs, { color: config.theme.accent }]}>VS</Text>
              </View>
              <Text style={styles.fixtureTeam} numberOfLines={1}>{away.shortName}</Text>
              {config.showBadges && <TeamBadge team={away} size="sm" />}
            </View>
          );
        })}
      </View>
      {config.showSponsor && (
        <Text style={styles.previewSponsor}>Lagos Summer Cup 2026</Text>
      )}
    </PreviewBackground>
  );
}

function AwardPreview({ config }: { config: GraphicConfig }) {
  const players = repository.getPlayersByTeam("islanders");
  const mvp = players.find((p) => p.awards.length > 0) ?? players[0];

  return (
    <PreviewBackground config={config} style={styles.previewPortrait}>
      <Text style={[styles.awardLabel, { color: config.theme.accent + "CC" }]}>
        Player of the Match
      </Text>
      <View style={[styles.awardNumberBadge, { backgroundColor: config.theme.accent + "33" }]}>
        <Text style={[styles.awardNumber, { color: config.theme.accent }]}>
          {mvp?.jerseyNumber}
        </Text>
      </View>
      <Text style={styles.awardName} numberOfLines={2}>{mvp?.name ?? "—"}</Text>
      <Text style={styles.awardPosition}>{mvp?.position}</Text>
      <View style={styles.awardStats}>
        <Text style={styles.awardStat}>{mvp?.goals ?? 0} goals</Text>
        <Text style={styles.awardStatSep}>·</Text>
        <Text style={styles.awardStat}>{mvp?.assists ?? 0} assists</Text>
      </View>
      {config.showSponsor && (
        <Text style={styles.previewSponsor}>Lagos Summer Cup 2026</Text>
      )}
    </PreviewBackground>
  );
}

function WinnerPreview({ config }: { config: GraphicConfig }) {
  const team = repository.getTeamById("islanders");

  return (
    <PreviewBackground config={config} style={styles.previewPortrait}>
      <Text style={[styles.awardLabel, { color: config.theme.accent + "CC" }]}>
        Tournament Champions
      </Text>
      {config.showBadges && team ? <TeamBadge team={team} size="lg" /> : null}
      <Text style={styles.awardName} numberOfLines={2}>{team?.name ?? "—"}</Text>
      <Text style={styles.awardPosition}>{team?.city}</Text>
      <Text style={[styles.awardStat, { color: config.theme.accent }]}>
        Lagos Summer Cup 2026
      </Text>
      {config.showSponsor && (
        <Text style={styles.previewSponsor}>Presented by BlueVolt Energy</Text>
      )}
    </PreviewBackground>
  );
}

const PREVIEWS: Record<GraphicTemplate["type"], React.FC<{ config: GraphicConfig }>> = {
  scorecard: ScorecardPreview,
  fixtures: FixturePreview,
  award: AwardPreview,
  winner: WinnerPreview,
};

// ─── Customisation controls ───────────────────────────────────────────────────
function ThemePicker({ current, onChange }: { current: Theme; onChange: (t: Theme) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.themeScroll}
      accessibilityLabel="Color theme picker"
    >
      {THEMES.map((t) => {
        const selected = current.id === t.id;
        return (
          <Pressable
            key={t.id}
            style={[styles.themeSwatch, selected && styles.themeSwatchSelected]}
            onPress={() => onChange(t)}
            accessibilityRole="button"
            accessibilityLabel={`${t.label} theme`}
            accessibilityState={{ selected }}
            hitSlop={4}
          >
            <LinearGradient
              colors={[t.bg1, t.bg2]}
              style={styles.themeGradient}
            >
              <View style={[styles.themeAccentDot, { backgroundColor: t.accent }]} />
            </LinearGradient>
            {selected && (
              <View style={styles.themeCheck}>
                <Check color="#fff" size={12} />
              </View>
            )}
            <Text style={[styles.themeLabel, selected && { color: colors.text }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function BgStylePicker({ current, onChange }: { current: BgStyle; onChange: (s: BgStyle) => void }) {
  const options: Array<{ id: BgStyle; label: string }> = [
    { id: "gradient", label: "Gradient" },
    { id: "flat", label: "Flat" },
    { id: "split", label: "Split" },
  ];
  return (
    <View style={styles.bgStyleRow}>
      {options.map((o) => {
        const active = current === o.id;
        return (
          <Pressable
            key={o.id}
            style={[styles.bgStyleBtn, active && styles.bgStyleBtnActive]}
            onPress={() => onChange(o.id)}
            accessibilityRole="button"
            accessibilityLabel={`${o.label} background`}
            accessibilityState={{ selected: active }}
            hitSlop={4}
          >
            <Text style={[styles.bgStyleTxt, active && styles.bgStyleTxtActive]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof EyeOff;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow} accessibilityLabel={label}>
      <Icon color={colors.textMuted} size={18} />
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceSoft, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.textSubtle}
        accessibilityLabel={label}
      />
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function GraphicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = repository.getGraphicTemplates().find((t) => t.id === id);

  const [config, setConfig] = useState<GraphicConfig>({
    theme: THEMES[0],
    bgStyle: "gradient",
    showSponsor: true,
    showBadges: true,
    boldText: true,
  });

  const patch = (partial: Partial<GraphicConfig>) =>
    setConfig((prev) => ({ ...prev, ...partial }));

  if (!template) {
    return (
      <View style={styles.notFoundWrap}>
        <Stack.Screen options={{ title: "Graphic Studio" }} />
        <Text style={styles.notFound}>Template not found.</Text>
      </View>
    );
  }

  const Preview = PREVIEWS[template.type] ?? ScorecardPreview;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: template.title }} />

      {/* Live preview */}
      <Preview config={config} />

      {/* ── Theme ── */}
      <SectionHeader title="Color theme" />
      <ThemePicker current={config.theme} onChange={(theme) => patch({ theme })} />

      {/* ── Background style ── */}
      <SectionHeader title="Background" />
      <BgStylePicker current={config.bgStyle} onChange={(bgStyle) => patch({ bgStyle })} />

      {/* ── Options ── */}
      <SectionHeader title="Options" />
      <View style={styles.optionsCard}>
        <ToggleRow
          icon={Users}
          label="Show team badges"
          value={config.showBadges}
          onChange={(showBadges) => patch({ showBadges })}
        />
        <View style={styles.divider} />
        <ToggleRow
          icon={EyeOff}
          label="Show sponsor text"
          value={config.showSponsor}
          onChange={(showSponsor) => patch({ showSponsor })}
        />
        <View style={styles.divider} />
        <ToggleRow
          icon={Type}
          label="Bold headings"
          value={config.boldText}
          onChange={(boldText) => patch({ boldText })}
        />
      </View>

      {/* ── Template details ── */}
      <SectionHeader title="Template details" />
      <View style={styles.metaCard}>
        <MetaRow label="Type" value={template.type} />
        <View style={styles.divider} />
        <MetaRow label="Aspect ratio" value={template.ratio} />
        <View style={styles.divider} />
        <MetaRow label="Export" value={template.exportTargets.join(" · ")} />
      </View>
      <Text style={styles.description} numberOfLines={4}>
        {template.description}
      </Text>

      {/* ── Export ── */}
      <PrimaryButton
        label="Export graphic"
        icon={<Download color={colors.text} size={18} />}
        style={styles.cta}
        accessibilityLabel="Export graphic to file"
      />
      <PrimaryButton
        label="Share"
        variant="secondary"
        icon={<Share2 color={colors.text} size={18} />}
        accessibilityLabel="Share graphic"
      />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  notFoundWrap: { flex: 1, backgroundColor: colors.background, padding: 20 },
  notFound: { color: colors.text, fontFamily: "Sora_800ExtraBold", fontSize: 22, marginTop: 8 },

  // Scorecard (1:1)
  previewSquare: {
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginTop: 8,
    justifyContent: "space-between",
  },
  scorecardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scorecardTeam: { flex: 1, alignItems: "center", gap: 10 },
  scorecardShort: { color: colors.text, fontFamily: "Sora_600SemiBold", fontSize: 15 },
  scorecardShortBold: { color: colors.text, fontFamily: "Sora_800ExtraBold", fontSize: 15 },
  scorecardCenter: { alignItems: "center", gap: 6 },
  scorecardScore: { color: colors.text, fontFamily: "Sora_800ExtraBold", fontSize: 46 },
  scorecardTimer: { fontFamily: "Sora_800ExtraBold", fontSize: 11, textTransform: "uppercase" },

  // Fixture (9:16)
  previewVertical: {
    aspectRatio: 9 / 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    padding: 20,
    justifyContent: "space-between",
    alignSelf: "center",
    width: "62%",
  },
  fixtureHeadline: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 20,
    lineHeight: 27,
  },
  fixtureList: { gap: 10 },
  fixtureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  fixtureTeam: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 13,
    textAlign: "center",
  },
  fixtureVsBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  fixtureVs: { fontFamily: "Sora_800ExtraBold", fontSize: 9 },

  // Award / Winner (4:5)
  previewPortrait: {
    aspectRatio: 4 / 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    padding: 24,
    justifyContent: "flex-end",
    gap: 8,
  },
  awardLabel: {
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  awardNumberBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  awardNumber: { fontFamily: "Sora_800ExtraBold", fontSize: 26 },
  awardName: { color: colors.text, fontFamily: "Sora_800ExtraBold", fontSize: 24, lineHeight: 30 },
  awardPosition: { color: "rgba(255,255,255,0.55)", fontFamily: "Sora_500Medium", fontSize: 13 },
  awardStats: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  awardStat: { color: "rgba(255,255,255,0.8)", fontFamily: "Sora_700Bold", fontSize: 12 },
  awardStatSep: { color: "rgba(255,255,255,0.35)", fontFamily: "Sora_700Bold", fontSize: 12 },

  // Shared preview
  previewKicker: { fontFamily: "Sora_800ExtraBold", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6 },
  previewSponsor: { color: "rgba(255,255,255,0.35)", fontFamily: "Sora_700Bold", fontSize: 9 },

  // Theme picker
  themeScroll: { gap: 10, paddingBottom: 4 },
  themeSwatch: {
    alignItems: "center",
    gap: 6,
    opacity: 0.72,
  },
  themeSwatchSelected: { opacity: 1 },
  themeGradient: {
    width: 58,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 8,
  },
  themeAccentDot: { width: 14, height: 14, borderRadius: 7 },
  themeCheck: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  themeLabel: {
    color: colors.textSubtle,
    fontFamily: "Sora_600SemiBold",
    fontSize: 11,
  },

  // Bg style
  bgStyleRow: { flexDirection: "row", gap: 10 },
  bgStyleBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  bgStyleBtnActive: { borderColor: colors.secondary, backgroundColor: "#0d2535" },
  bgStyleTxt: { color: colors.textMuted, fontFamily: "Sora_600SemiBold", fontSize: 13 },
  bgStyleTxtActive: { color: colors.secondary },

  // Options card
  optionsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  toggleLabel: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_600SemiBold",
    fontSize: 14,
  },
  divider: { height: 1, backgroundColor: colors.border },

  // Meta card
  metaCard: {
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  metaLabel: { color: colors.textMuted, fontFamily: "Sora_500Medium", fontSize: 13 },
  metaValue: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 13,
    textTransform: "capitalize",
    textAlign: "right",
  },
  description: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 14,
    marginBottom: 18,
  },
  cta: { marginBottom: 10 },
});
