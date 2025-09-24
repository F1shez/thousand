import { Text, View } from 'react-native';
interface InfoBarProps {
  rightWordsCount: number;
  wrongWordsCount: number;
}
export function InfoBar(props: InfoBarProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Text style={{ color: 'green' }}>{props.rightWordsCount}</Text>
      <Text>/</Text>
      <Text style={{ color: 'red' }}>{props.wrongWordsCount}</Text>
    </View>
  );
}
