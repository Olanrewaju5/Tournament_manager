import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftRight, Check, MessageSquare, Minus, Plus,
  Save, Square, Target, Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { CardColor, MatchEvent, MatchEventType, MatchStatus, Player, PlayerRating } from "@/types/domain";

// ─── Status picker ────────────────────────────────────────────────────────────
const STATUSES: Array<{ id: MatchStatus; label: string; color: string }> = [
  { id: "scheduled", label: "Scheduled", color: colors.textMuted },
  { id: "live", label: "Live", color: colors.success },
  { id: "final", label: "Final", color: colors.secondary },
];

// ─── Event types ──────────────────────────────────────────────────────────────
const EVENT_TYPES: Array<{ id: MatchEventType; label: string; icon: typeof Target; color: string }> = [
  { id: "goal", label: "Goal", icon: Target, color: colors.success },
  { id: "card", label: "Card", icon: Square, color: colors.warning },
  { id: "substitution", label: "Sub", icon: ArrowLeftRight, color: colors.secondary },
  { id: "commentary", label: "Note", icon: MessageSquare, color: colors.textMuted },
];

// ─── Rating pills ─────────────────────────────────────────────────────────────
const RATING_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function ratingColor(r: number): string {
  if (r >= 8) return colors.success;
  if (r >= 6) return colors.secondary;
  if (r >= 4) return colors.warning;
  return colors.danger;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreControl({
  label, score, onMinus, onPlus,
}: { label: string; score: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.scoreControl}>
      <Text style={styles.scoreTeamLabel}>{label}</Text>
      <View style={styles.scoreRow}>
        <Pressable style={styles.scoreBtn} onPress={onMinus} hitSlop={8}>
          <Minus color={colors.text} size={20} />
        </Pressable>
        <Text style={styles.scoreValue}>{score}</Text>
        <Pressable style={styles.scoreBtn} onPress={onPlus} hitSlop={8}>
          <Plus color={colors.text} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function PlayerRatingRow({
  player, existing, onRate,
}: { player: Player; existing?: PlayerRating; onRate: (r: number) => void }) {
  const current = existing?.rating ?? 0;
  return (
    <View style={styles.ratingPlayerRow}>
      <View style={styles.ratingPlayerInfo}>
        <Text style={styles.ratingPlayerName}>{player.name}</Text>
        <Text style={styles.ratingPlayerPos}>{player.position} · #{player.jerseyNumber}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ratingPills}>
        {RATING_VALUES.map((v) => {
          const selected = current === v;
          const c = ratingColor(v);
          return (
            <Pressable
              key={v}
              style={[styles.ratingPill, selected && { backgroundColor: c, borderColor: c }]}
              onPress={() => onRate(v)}
            >
              <Text style={[styles.ratingPillText, selected && { color: "#fff" }]}>{v}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function MatchEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const baseMatch = repository.getMatchById(id);

  const {
    matchEdits,
    initMatchEdit,
    updateMatchScore,
    updateMatchStatus,
    addMatchEvent,
    removeMatchEvent,
    setPlayerRating,
  } = useAppStore();

  useEffect(() => {
    if (baseMatch) initMatchEdit(baseMatch);
  }, [baseMatch?.id]);

  const edit = matchEdits[id ?? ""];

  // Event form state
  const [eventType, setEventType] = useState<MatchEventType>("goal");
  const [cardColor, setCardColor] = useState<CardColor>("yellow");
  const [eventTeam, setEventTeam] = useState<"home" | "away">("home");
  const [eventMinute, setEventMinute] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [eventNote, setEventNote] = useState("");

  if (!baseMatch || !edit) {
    return (
      <ScrollView style={styles.scroll}>
        <Stack.Screen options={{ title: "Match editor" }} />
        <Text style={styles.emptyText}>Match not found.</Text>
      </ScrollView>
    );
  }

  const home = repository.getTeamById(baseMatch.homeTeamId);
  const away = repository.getTeamById(baseMatch.awayTeamId);
  if (!home || !away) return null;

  const homePlayers = repository.getPlayersByTeam(home.id);
  const awayPlayers = repository.getPlayersByTeam(away.id);

  function handleAddEvent() {
    const min = parseInt(eventMinute, 10);
    if (isNaN(min) || min < 0 || min > 200) {
      Alert.alert("Invalid", "Enter a valid minute (0–200).");
      return;
    }
    if (eventType !== "commentary" && !playerName.trim()) {
      Alert.alert("Required", "Player name is required for this event type.");
      return;
    }

    const event: MatchEvent = {
      id: `ev-${Date.now()}`,
      minute: min,
      type: eventType,
      teamId: eventTeam === "home" ? home!.id : away!.id,
      playerName: playerName.trim() || undefined,
      note: eventNote.trim() || `${eventType} at ${min}'`,
      cardColor: eventType === "card" ? cardColor : undefined,
    };
    addMatchEvent(id, event);
    setEventMinute("");
    setPlayerName("");
    setEventNote("");
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: `Edit · ${home.shortName} vs ${away.shortName}`,
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 4 }}>
              <Save color={colors.secondary} size={22} />
            </Pressable>
          ),
        }}
      />

      {/* ── Match Status ── */}
      <Text style={styles.sectionLabel}>Match status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => {
          const active = edit.status === s.id;
          return (
            <Pressable
              key={s.id}
              style={[styles.statusBtn, active && { borderColor: s.color, backgroundColor: `${s.color}18` }]}
              onPress={() => updateMatchStatus(id, s.id)}
            >
              {active && <Check color={s.color} size={14} />}
              <Text style={[styles.statusText, active && { color: s.color }]}>{s.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Score ── */}
      <Text style={styles.sectionLabel}>Score</Text>
      <View style={styles.scoreCard}>
        <ScoreControl
          label={home.shortName}
          score={edit.homeScore}
          onMinus={() => updateMatchScore(id, "home", -1)}
          onPlus={() => updateMatchScore(id, "home", 1)}
        />
        <Text style={styles.scoreSep}>:</Text>
        <ScoreControl
          label={away.shortName}
          score={edit.awayScore}
          onMinus={() => updateMatchScore(id, "away", -1)}
          onPlus={() => updateMatchScore(id, "away", 1)}
        />
      </View>

      {/* ── Add Event ── */}
      <Text style={styles.sectionLabel}>Log event</Text>
      <View style={styles.card}>
        {/* Event type row */}
        <View style={styles.eventTypeRow}>
          {EVENT_TYPES.map((et) => {
            const Icon = et.icon;
            const active = eventType === et.id;
            return (
              <Pressable
                key={et.id}
                style={[styles.eventTypeBtn, active && { borderColor: et.color, backgroundColor: `${et.color}18` }]}
                onPress={() => setEventType(et.id)}
              >
                <Icon color={active ? et.color : colors.textMuted} size={16} />
                <Text style={[styles.eventTypeTxt, active && { color: et.color }]}>{et.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card color picker */}
        {eventType === "card" && (
          <View style={styles.cardColorRow}>
            {(["yellow", "red"] as CardColor[]).map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.cardColorBtn,
                  cardColor === c && { borderColor: c === "red" ? colors.danger : colors.warning },
                ]}
                onPress={() => setCardColor(c)}
              >
                <View style={[styles.cardColorSwatch, { backgroundColor: c === "red" ? colors.danger : colors.warning }]} />
                <Text style={styles.cardColorLabel}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
                {cardColor === c && <Check color={colors.text} size={14} />}
              </Pressable>
            ))}
          </View>
        )}

        {/* Team + Minute */}
        <View style={styles.inlineRow}>
          <View style={styles.teamToggle}>
            {(["home", "away"] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.teamToggleBtn, eventTeam === t && styles.teamToggleActive]}
                onPress={() => setEventTeam(t)}
              >
                <Text style={[styles.teamToggleTxt, eventTeam === t && styles.teamToggleActiveTxt]}>
                  {t === "home" ? home.shortName : away.shortName}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={[styles.input, styles.minuteInput]}
            value={eventMinute}
            onChangeText={setEventMinute}
            placeholder="Min"
            placeholderTextColor={colors.textSubtle}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>

        {/* Player name */}
        {eventType !== "commentary" && (
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Player name"
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="words"
          />
        )}

        {/* Note */}
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={eventNote}
          onChangeText={setEventNote}
          placeholder="Short note (optional)"
          placeholderTextColor={colors.textSubtle}
          maxLength={120}
        />

        <Pressable style={styles.addEventBtn} onPress={handleAddEvent}>
          <Plus color={colors.text} size={16} />
          <Text style={styles.addEventTxt}>Add to event feed</Text>
        </Pressable>
      </View>

      {/* ── Event Feed (editable) ── */}
      {edit.events.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Event feed ({edit.events.length})</Text>
          <View style={styles.feedList}>
            {edit.events.map((event) => {
              const isRed = event.type === "card" && event.cardColor === "red";
              const iconColor = event.type === "card"
                ? (isRed ? colors.danger : colors.warning)
                : EVENT_TYPES.find((e) => e.id === event.type)?.color ?? colors.textMuted;
              const EventIcon = EVENT_TYPES.find((e) => e.id === event.type)?.icon ?? MessageSquare;
              return (
                <View key={event.id} style={styles.feedRow}>
                  <View style={[styles.eventIconSmall, { backgroundColor: `${iconColor}22` }]}>
                    <EventIcon color={iconColor} size={14} />
                  </View>
                  <View style={styles.feedCopy}>
                    <Text style={styles.feedTitle}>{event.minute}' · {event.playerName ?? "Note"}</Text>
                    <Text style={styles.feedNote}>{event.note}</Text>
                  </View>
                  <Pressable onPress={() => removeMatchEvent(id, event.id)} hitSlop={8}>
                    <Trash2 color={colors.danger} size={18} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* ── Player Performance Ratings ── */}
      <Text style={styles.sectionLabel}>{home.shortName} — ratings</Text>
      <View style={styles.card}>
        {homePlayers.length === 0
          ? <Text style={styles.emptyText}>No players registered for {home.name}.</Text>
          : homePlayers.map((p) => (
            <PlayerRatingRow
              key={p.id}
              player={p}
              existing={edit.ratings.find((r) => r.playerId === p.id)}
              onRate={(rating) =>
                setPlayerRating(id, {
                  playerId: p.id,
                  playerName: p.name,
                  teamId: p.teamId,
                  rating,
                })
              }
            />
          ))}
      </View>

      <Text style={styles.sectionLabel}>{away.shortName} — ratings</Text>
      <View style={styles.card}>
        {awayPlayers.length === 0
          ? <Text style={styles.emptyText}>No players registered for {away.name}.</Text>
          : awayPlayers.map((p) => (
            <PlayerRatingRow
              key={p.id}
              player={p}
              existing={edit.ratings.find((r) => r.playerId === p.id)}
              onRate={(rating) =>
                setPlayerRating(id, {
                  playerId: p.id,
                  playerName: p.name,
                  teamId: p.teamId,
                  rating,
                })
              }
            />
          ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 48 },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 22,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  // Status
  statusRow: { flexDirection: "row", gap: 10 },
  statusBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  statusText: { color: colors.textMuted, fontFamily: "Sora_700Bold", fontSize: 13 },
  // Score
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 20,
  },
  scoreControl: { alignItems: "center", gap: 10, flex: 1 },
  scoreTeamLabel: { color: colors.textMuted, fontFamily: "Sora_700Bold", fontSize: 12 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  scoreBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreValue: { color: colors.text, fontFamily: "Sora_800ExtraBold", fontSize: 44, minWidth: 52, textAlign: "center" },
  scoreSep: { color: colors.textSubtle, fontFamily: "Sora_800ExtraBold", fontSize: 28 },
  // Event form
  eventTypeRow: { flexDirection: "row", gap: 8 },
  eventTypeBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  eventTypeTxt: { color: colors.textMuted, fontFamily: "Sora_600SemiBold", fontSize: 11 },
  cardColorRow: { flexDirection: "row", gap: 10 },
  cardColorBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  cardColorSwatch: { width: 16, height: 20, borderRadius: 3 },
  cardColorLabel: { flex: 1, color: colors.textMuted, fontFamily: "Sora_600SemiBold", fontSize: 13 },
  inlineRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  teamToggle: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  teamToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
  },
  teamToggleActive: { backgroundColor: colors.primary },
  teamToggleTxt: { color: colors.textMuted, fontFamily: "Sora_700Bold", fontSize: 13 },
  teamToggleActiveTxt: { color: colors.text },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  minuteInput: { width: 70, textAlign: "center" },
  noteInput: {},
  addEventBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 13,
  },
  addEventTxt: { color: colors.text, fontFamily: "Sora_700Bold", fontSize: 14 },
  // Feed list
  feedList: { gap: 8 },
  feedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  eventIconSmall: {
    width: 34,
    height: 34,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  feedCopy: { flex: 1 },
  feedTitle: { color: colors.text, fontFamily: "Sora_700Bold", fontSize: 13 },
  feedNote: { color: colors.textMuted, fontFamily: "Sora_400Regular", fontSize: 12, marginTop: 2 },
  // Player ratings
  ratingPlayerRow: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ratingPlayerInfo: {},
  ratingPlayerName: { color: colors.text, fontFamily: "Sora_700Bold", fontSize: 14 },
  ratingPlayerPos: { color: colors.textMuted, fontFamily: "Sora_400Regular", fontSize: 12, marginTop: 2 },
  ratingPills: { flexDirection: "row", gap: 7, paddingVertical: 4 },
  ratingPill: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  ratingPillText: { color: colors.textMuted, fontFamily: "Sora_700Bold", fontSize: 13 },
  emptyText: { color: colors.textMuted, fontFamily: "Sora_400Regular", fontSize: 13 },
});
