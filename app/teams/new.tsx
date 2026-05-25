import { router, Stack } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { Team } from "@/types/domain";

const PRESET_COLORS: [string, string][] = [
  ["#2563FF", "#1E40AF"],
  ["#EF4444", "#991B1B"],
  ["#22C55E", "#15803D"],
  ["#F97316", "#C2410C"],
  ["#A855F7", "#7E22CE"],
  ["#EC4899", "#9D174D"],
  ["#14B8A6", "#0F766E"],
  ["#EAB308", "#A16207"],
];

export default function NewTeamScreen() {
  const addTeam = useAppStore((s) => s.addTeam);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [city, setCity] = useState("");
  const [captain, setCaptain] = useState("");
  const [bio, setBio] = useState("");
  const [colorPair, setColorPair] = useState<[string, string]>(PRESET_COLORS[0]);

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert("Required", "Team name is required.");
      return;
    }
    if (!shortName.trim()) {
      Alert.alert("Required", "Short name (abbreviation) is required.");
      return;
    }
    if (shortName.trim().length > 4) {
      Alert.alert("Too long", "Short name must be 4 characters or fewer.");
      return;
    }

    const team: Team = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      city: city.trim() || "Unknown",
      colors: colorPair,
      captain: captain.trim() || "TBD",
      bio: bio.trim() || `${name.trim()} — ready to compete.`,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    addTeam(team);
    router.replace(`/teams/${team.id}`);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "New team" }} />

      <Text style={styles.sectionLabel}>Team details</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Team name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Lagos FC"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
          maxLength={50}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Abbreviation *</Text>
          <TextInput
            style={styles.input}
            value={shortName}
            onChangeText={setShortName}
            placeholder="LFC"
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="characters"
            maxLength={4}
          />
        </View>
        <View style={[styles.field, { flex: 1.6 }]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Lagos"
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Captain name</Text>
        <TextInput
          style={styles.input}
          value={captain}
          onChangeText={setCaptain}
          placeholder="Player full name"
          placeholderTextColor={colors.textSubtle}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Team bio</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={bio}
          onChangeText={setBio}
          placeholder="A short description of the team..."
          placeholderTextColor={colors.textSubtle}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
      </View>

      <Text style={styles.sectionLabel}>Team colors</Text>
      <View style={styles.colorGrid}>
        {PRESET_COLORS.map(([primary, secondary]) => {
          const selected = colorPair[0] === primary;
          return (
            <Pressable
              key={primary}
              style={[styles.colorSwatch, { backgroundColor: primary }, selected && styles.swatchSelected]}
              onPress={() => setColorPair([primary, secondary])}
            >
              {selected && <Check color="#fff" size={18} />}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.colorPreview}>
        <View style={[styles.colorChip, { backgroundColor: colorPair[0] }]}>
          <Text style={styles.colorChipLabel}>Primary</Text>
        </View>
        <View style={[styles.colorChip, { backgroundColor: colorPair[1] }]}>
          <Text style={styles.colorChipLabel}>Secondary</Text>
        </View>
      </View>

      <PrimaryButton
        label="Create team"
        onPress={handleCreate}
        style={styles.submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
  },
  field: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
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
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: colors.text,
  },
  colorPreview: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  colorChip: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colorChipLabel: {
    color: "#fff",
    fontFamily: "Sora_700Bold",
    fontSize: 12,
  },
  submit: {
    marginTop: 28,
  },
});
