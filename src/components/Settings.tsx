import { Button, StyleSheet, Text, View } from "react-native";

interface SettingsProps {
  setShowSettings: (value: boolean) => void;
  resetFrequency: () => void;
}

export function Settings(props: SettingsProps) {
  return (
    <View style={styles.settings}>
      <Button
        title="closeSettings"
        onPress={() => {
          props.setShowSettings(false);
        }}
      />
      <Text>Settings</Text>
      <Button
        title="Reset frequency words"
        onPress={() => props.resetFrequency()}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  settings: {
    backgroundColor: "#000",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});
