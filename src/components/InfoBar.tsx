import { StyleSheet, Text, View } from 'react-native';
import { S } from '../../constants/spacing';
import { useStatisticsStore } from '../store/useStatisticsStore ';

export function InfoBar() {
  const { sessionRightWords, sessionWrongWords } = useStatisticsStore();

  return (
    <View style={styles.container}>
      <Text style={styles.rightCount}>{sessionRightWords}</Text>
      <Text>/</Text>
      <Text style={styles.wrongCount}>{sessionWrongWords}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: S.xxsmall,
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
