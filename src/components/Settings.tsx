import { CircleX } from 'lucide-react-native';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { S } from '../../constants/spacing';

interface SettingsProps {
  setShowSettings: (value: boolean) => void;
  resetFrequency: () => void;
}

export function Settings(props: SettingsProps) {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.body]}>
      <View style={styles.rowContainer}>
        <Text style={styles.header}>Settings</Text>
        <TouchableOpacity
          style={{ marginRight: S.xsmall }}
          onPress={() => {
            props.setShowSettings(false);
          }}
        >
          <CircleX color="black" size={24} />
        </TouchableOpacity>
      </View>
      <Button
        title="Reset frequency words"
        onPress={() => props.resetFrequency()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    paddingLeft: S.xsmall,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: S.small,
    marginTop: S.xsmall,
  },
  settingsButton: {
    position: 'absolute',
    top: S.xsmall,
    right: S.xsmall,
  },
});
