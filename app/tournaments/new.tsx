import { router, Stack } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { Tournament, TournamentFormat } from "@/types/domain";

const FORMATS: Array<{ id: TournamentFormat; label: string; desc: string }> = [
  { id: "league", label: "League", desc: "Everyone plays everyone. Points decide the winner." },
  { id: "knockout", label: "Knockout", desc: "Single elimination. Lose once, you're out." },
  { id: "round-robin", label: "Round Robin", desc: "Full round-robin with a final between top two." },
  { id: "group-stage", label: "Group Stage", desc: "Groups + knockout rounds." },
  { id: "hybrid", label: "Hybrid", desc: "Custom mix of group and knockout phases." },
  { id: "double-elimination", label: "Double Elimination", desc: "Two losses needed to be knocked out." },
];

const SPORTS = ["Football", "Basketball", "Volleyball", "Tennis", "Badminton", "Other"];

const ACCENT_COLORS = [
  "#2563FF", "#00C2FF", "#22C55E", "#F97316",
  "#A855F7", "#EC4899", "#EF4444", "#EAB308",
];

export default function NewTournamentScreen() {
  const addTournament = useAppStore((s) => s.addTournament);

  const [name, setName] = useState("");
  const [sport, setSport] = useState("Football");
  const [format, setFormat] = useState<TournamentFormat>("league");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teamLimit, setTeamLimit] = useState("8");
  const [prizePool, setPrizePool] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [description, setDescription] = useState("");
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Required", "Tournament name is required.");
      return;
    }
    const limit = parseInt(teamLimit, 10);
    if (isNaN(limit) || limit < 2) {
      Alert.alert("Invalid", "Team limit must be at least 2.");
      return;
    }

    const now = new Date();
    const starts = startsAt.trim()
      ? new Date(startsAt.trim()).toISOString()
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const regDeadline = deadline.trim()
      ? new Date(deadline.trim()).toISOString()
      : new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const tournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: name.trim(),
      sport,
      format,
      status: "draft",
      venue: venue.trim() || "TBD",
      organizer: organizer.trim() || "You",
      startsAt: starts,
      registrationDeadline: regDeadline,
      teamLimit: limit,
      registeredTeams: 0,
      prizePool: prizePool.trim() || "TBD",
      sponsor: sponsor.trim() || "—",
      accentColor,
      description: description.trim() || `${name.trim()} — a new ${sport.toLowerCase()} competition.`,
    };

    addTournament(tournament);
    router.replace(`/tournaments/${tournament.id}`);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "New tournament" }} />

      <Text style={styles.sectionLabel}>Basic info</Text>

      <Field label="Tournament name *">
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Lagos Summer Cup 2026"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
          maxLength={60}
        />
      </Field>

      <Field label="Organizer / club name">
        <TextInput
          style={styles.input}
          value={organizer}
          onChangeText={setOrganizer}
          placeholder="Your name or organisation"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
        />
      </Field>

      <Field label="Venue">
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="Stadium or ground name"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
        />
      </Field>

      <Field label="Description">
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell teams and fans what this competition is about…"
          placeholderTextColor={colors.textSubtle}
          multiline
          numberOfLines={3}
          maxLength={240}
        />
      </Field>

      <Text style={styles.sectionLabel}>Sport</Text>
      <View style={styles.chipRow}>
        {SPORTS.map((s) => (
          <Pressable
            key={s}
            style={[styles.chip, sport === s && styles.chipSelected]}
            onPress={() => setSport(s)}
          >
            <Text style={[styles.chipText, sport === s && styles.chipTextSelected]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Format</Text>
      <View style={styles.formatList}>
        {FORMATS.map((f) => {
          const selected = format === f.id;
          return (
            <Pressable
              key={f.id}
              style={[styles.formatRow, selected && styles.formatSelected]}
              onPress={() => setFormat(f.id)}
            >
              <View style={styles.formatCopy}>
                <Text style={styles.formatLabel}>{f.label}</Text>
                <Text style={styles.formatDesc}>{f.desc}</Text>
              </View>
              {selected && <Check color={colors.secondary} size={18} />}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Registration &amp; teams</Text>
      <View style={styles.row}>
        <Field label="Max teams *" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={teamLimit}
            onChangeText={setTeamLimit}
            placeholder="8"
            placeholderTextColor={colors.textSubtle}
            keyboardType="number-pad"
            maxLength={3}
          />
        </Field>
        <Field label="Prize pool" style={{ flex: 1.4 }}>
          <TextInput
            style={styles.input}
            value={prizePool}
            onChangeText={setPrizePool}
            placeholder="₦500K"
            placeholderTextColor={colors.textSubtle}
          />
        </Field>
      </View>

      <View style={styles.row}>
        <Field label="Start date (YYYY-MM-DD)" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={startsAt}
            onChangeText={setStartsAt}
            placeholder="2026-06-01"
            placeholderTextColor={colors.textSubtle}
            keyboardType="numbers-and-punctuation"
          />
        </Field>
        <Field label="Reg. deadline" style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="2026-05-28"
            placeholderTextColor={colors.textSubtle}
            keyboardType="numbers-and-punctuation"
          />
        </Field>
      </View>

      <Field label="Sponsor">
        <TextInput
          style={styles.input}
          value={sponsor}
          onChangeText={setSponsor}
          placeholder="Sponsor name (optional)"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
        />
      </Field>

      <Text style={styles.sectionLabel}>Accent color</Text>
      <View style={styles.colorGrid}>
        {ACCENT_COLORS.map((c) => (
          <Pressable
            key={c}
            style={[styles.colorSwatch, { backgroundColor: c }, accentColor === c && styles.swatchSelected]}
            onPress={() => setAccentColor(c)}
          >
            {accentColor === c && <Check color="#fff" size={18} />}
          </Pressable>
        ))}
      </View>
      <View style={[styles.colorPreview, { backgroundColor: accentColor }]}>
        <Text style={styles.colorPreviewText}>{name.trim() || "Tournament name"}</Text>
      </View>

      <PrimaryButton label="Create tournament" onPress={handleCreate} style={styles.submit} />
    </ScrollView>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 48 },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    fontFamily: "Sora_400Regular",
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  row: { flexDirection: "row", gap: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.secondary, backgroundColor: "#0d2535" },
  chipText: { color: colors.textMuted, fontFamily: "Sora_600SemiBold", fontSize: 13 },
  chipTextSelected: { color: colors.secondary },
  formatList: { gap: 8 },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
  },
  formatSelected: { borderColor: colors.secondary, backgroundColor: "#0d2535" },
  formatCopy: { flex: 1 },
  formatLabel: { color: colors.text, fontFamily: "Sora_700Bold", fontSize: 14 },
  formatDesc: { color: colors.textMuted, fontFamily: "Sora_400Regular", fontSize: 12, marginTop: 3, lineHeight: 17 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: { borderColor: colors.text },
  colorPreview: {
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  colorPreviewText: {
    color: "#fff",
    fontFamily: "Sora_800ExtraBold",
    fontSize: 15,
  },
  submit: { marginTop: 28 },
});
