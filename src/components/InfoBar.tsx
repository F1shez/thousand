import { StyleSheet, Text, View } from 'react-native';
interface InfoBarProps {
  rightWordsCount: number;
  wrongWordsCount: number;
}
export function InfoBar(props: InfoBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rightCount}>{props.rightWordsCount}</Text>
      <Text>/</Text>
      <Text style={styles.wrongCount}>{props.wrongWordsCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
