import { CircleX } from 'lucide-react-native';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { S } from '../../constants/spacing';
import { mode, AppSettings } from '../useSettings';
import { useStatisticsStore } from '../store/useStatisticsStore ';

interface SettingsProps {
  setShowSettings: (value: boolean) => void;
  resetFrequency: () => void;
  settings: AppSettings;
  toggleInputMode: () => void;
  toggleShowRandomlyTranslation: () => void;
}

export function Settings(props: SettingsProps) {
  const { totalRightWords, totalWrongWords, wordsHaveFrequencyZero } =
    useStatisticsStore();

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
      <View style={styles.content}>
        <View style={styles.button}>
          <Button
            title="Reset frequency words"
            onPress={() => props.resetFrequency()}
            color="#000000"
          />
        </View>
        <View style={styles.button}>
          <Button
            title={'current mode: ' + mode[props.settings.mode]}
            onPress={() => props.toggleInputMode()}
            color="#000000"
          />
        </View>
        <View style={styles.button}>
          <Button
            title={
              'show random translation: ' +
              props.settings.showRandomlyTranslation
            }
            onPress={() => props.toggleShowRandomlyTranslation()}
            color="#000000"
          />
        </View>

        <View style={styles.statistics}>
          <Text>Правильные/Неправильные слова за все время</Text>
          <Text style={styles.rightCount}>{totalRightWords}</Text>
          <Text>/</Text>
          <Text style={styles.wrongCount}>{totalWrongWords}</Text>
        </View>
        <View style={styles.statistics}>
          <Text>
            Количество выученных слов (угаданы 5 и более раз):{' '}
            {wordsHaveFrequencyZero}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
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
  button: {
    width: '50%',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  statistics: {
    width: '50%',
    marginBottom: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rightCount: {
    color: 'green',
  },
  wrongCount: {
    color: 'red',
  },
});
