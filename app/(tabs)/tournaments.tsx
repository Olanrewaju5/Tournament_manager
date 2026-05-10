import { router } from "expo-router";
import { CalendarDays, MapPin, Trophy } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { Tournament } from "@/types/domain";

export default function TournamentsScreen() {
  const tournaments = repository.getTournaments();
  const setSelectedTournamentId = useAppStore((state) => state.setSelectedTournamentId);

  return (
    <Screen>
      <Text style={styles.title}>Leagues & cups</Text>
      <Text style={styles.body}>Track registration, fixtures, sponsors, and matchday status from one place.</Text>
      <SectionHeader title="Active competitions" />
      <View style={styles.list}>
        {tournaments.map((tournament) => (
          <TournamentRow
            key={tournament.id}
            tournament={tournament}
            onPress={() => {
              setSelectedTournamentId(tournament.id);
              router.push(`/tournaments/${tournament.id}`);
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

function TournamentRow({ tournament, onPress }: { tournament: Tournament; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.logo, { backgroundColor: tournament.accentColor }]}>
        <Trophy color={colors.text} size={24} />
      </View>
      <View style={styles.copy}>
        <View style={styles.topLine}>
          <Text style={styles.name}>{tournament.name}</Text>
          <Text style={styles.status}>{tournament.status}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{tournament.description}</Text>
        <View style={styles.metaRow}>
          <MapPin color={colors.textSubtle} size={14} />
          <Text style={styles.meta}>{tournament.venue}</Text>
          <CalendarDays color={colors.textSubtle} size={14} />
          <Text style={styles.meta}>{tournament.registeredTeams}/{tournament.teamLimit} teams</Text>
        </View>
      </View>
    </Pressable>
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
  list: {
    gap: 12
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    flexDirection: "row",
    gap: 12
  },
  pressed: {
    opacity: 0.86
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  name: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16
  },
  status: {
    color: colors.success,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase"
  },
  description: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: "Sora_500Medium",
    fontSize: 11,
    marginRight: 8
  }
});
