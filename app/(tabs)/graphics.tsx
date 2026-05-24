import { router } from "expo-router";
import { ImagePlus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";

export default function GraphicsScreen() {
  const templates = repository.getGraphicTemplates();

  return (
    <Screen>
      <Text style={styles.title}>Media studio</Text>
      <Text style={styles.body}>Preview social-ready graphics powered by tournament data and team colors.</Text>
      <LinearGradient colors={["#2563FF", "#101018"]} style={styles.preview}>
        <Text style={styles.previewLabel}>Score Blast</Text>
        <Text style={styles.previewScore}>ISL 2 : 1 MNS</Text>
        <Text style={styles.previewBody}>Lagos Summer Cup · 68’ live</Text>
      </LinearGradient>
      <PrimaryButton label="Generate match graphic" icon={<ImagePlus color={colors.text} size={18} />} />
      <SectionHeader title="Templates" />
      <View style={styles.list}>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            style={({ pressed }) => [styles.template, pressed && styles.pressed]}
            onPress={() => router.push(`/graphics/${template.id}`)}
          >
            <View style={styles.templateArt}>
              <Text style={styles.templateType}>{template.type}</Text>
            </View>
            <View style={styles.templateCopy}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateBody}>{template.description}</Text>
              <Text style={styles.templateMeta}>{template.ratio} · {template.exportTargets.join(", ")}</Text>
            </View>
          </Pressable>
        ))}
      </View>
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
    marginTop: 8,
    marginBottom: 18
  },
  preview: {
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "flex-end",
    padding: 22,
    marginBottom: 12
  },
  previewLabel: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 13,
    textTransform: "uppercase"
  },
  previewScore: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 40,
    marginTop: 8
  },
  previewBody: {
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 13,
    marginTop: 8
  },
  list: {
    gap: 10
  },
  pressed: {
    opacity: 0.86
  },
  template: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12
  },
  templateArt: {
    width: 70,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  templateType: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 9,
    textTransform: "uppercase"
  },
  templateCopy: {
    flex: 1
  },
  templateTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15
  },
  templateBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  templateMeta: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    marginTop: 8
  }
});
