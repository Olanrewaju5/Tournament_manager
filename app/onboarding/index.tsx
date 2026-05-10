import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BellRing, ShieldCheck, Trophy, UsersRound } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RoleChoice } from "@/components/RoleChoice";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { UserRole } from "@/types/domain";

const roles: Array<{
  id: UserRole;
  title: string;
  description: string;
  icon: typeof Trophy;
}> = [
  {
    id: "organizer",
    title: "Tournament organizer",
    description: "Create fixtures, approve teams, run matchday, and share graphics.",
    icon: Trophy
  },
  {
    id: "team-manager",
    title: "Team manager",
    description: "Register your squad, track fixtures, and keep players ready.",
    icon: ShieldCheck
  },
  {
    id: "spectator",
    title: "Spectator",
    description: "Follow live scores, standings, awards, and your favorite teams.",
    icon: BellRing
  },
  {
    id: "player",
    title: "Player",
    description: "Build your profile, track stats, and collect matchday awards.",
    icon: UsersRound
  }
];

export default function OnboardingScreen() {
  const selectedRole = useAppStore((state) => state.selectedRole);
  const setSelectedRole = useAppStore((state) => state.setSelectedRole);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const finish = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <Screen scroll>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <LinearGradient colors={["#2563FF", "#00C2FF"]} style={styles.hero}>
        <Text style={styles.brand}>TournamentOS</Text>
        <Text style={styles.heroTitle}>Run matchday like the whole league is watching.</Text>
        <Text style={styles.heroBody}>Set your role once. We will shape the first dashboard around what you need to do next.</Text>
      </LinearGradient>

      <Text style={styles.question}>What are you here to do?</Text>
      <View style={styles.roles}>
        {roles.map((role) => (
          <RoleChoice
            key={role.id}
            title={role.title}
            description={role.description}
            icon={role.icon}
            selected={selectedRole === role.id}
            onPress={() => setSelectedRole(role.id)}
          />
        ))}
      </View>

      <View style={styles.commitment}>
        <Text style={styles.commitmentTitle}>Today’s setup goal</Text>
        <Text style={styles.commitmentBody}>Create or follow one tournament, add teams, and keep the next match visible.</Text>
      </View>

      <PrimaryButton label="Enter TournamentOS" onPress={finish} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    marginTop: 8,
    marginBottom: 18
  },
  progressFill: {
    width: "72%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.success
  },
  hero: {
    borderRadius: 8,
    padding: 22,
    minHeight: 220,
    justifyContent: "flex-end"
  },
  brand: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18,
    marginBottom: 34
  },
  heroTitle: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 28,
    lineHeight: 36
  },
  heroBody: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: "Sora_500Medium",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10
  },
  question: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 20,
    marginTop: 26,
    marginBottom: 12
  },
  roles: {
    gap: 10
  },
  commitment: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 18,
    marginBottom: 16
  },
  commitmentTitle: {
    color: colors.warning,
    fontFamily: "Sora_700Bold",
    fontSize: 13
  },
  commitmentBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6
  }
});
