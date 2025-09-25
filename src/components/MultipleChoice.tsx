import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { S } from '../../constants/spacing';

interface MultipleChoiceProps {
  rightTranslation: string;
  getRandomTranslation: () => string;
  callback: (word: string) => void;
}

export function MultipleChoice(props: MultipleChoiceProps) {
  const [words, setWords] = useState<string[]>([]);

  const getArrayRandomTranslation = useCallback(() => {
    const randomTranslations = [];
    for (let i = 0; i < 5; i++) {
      randomTranslations.push(props.getRandomTranslation());
    }
    return randomTranslations;
  }, [props]);

  useEffect(() => {
    setWords(
      getArrayRandomTranslation().toSpliced(
        Math.floor(Math.random() * 6),
        0,
        props.rightTranslation,
      ),
    );
  }, [getArrayRandomTranslation, props.rightTranslation]);

  return (
    <View style={style.body}>
      {words.length === 6
        ? words.map((word, index) => (
            <View key={index} style={style.button}>
              <Button
                color="#000000"
                title={word}
                onPress={() => {
                  props.callback(word);
                }}
              />
            </View>
          ))
        : null}
    </View>
  );
}

const style = StyleSheet.create({
  body: { flexDirection: 'row', flexWrap: 'wrap', padding: S.xlarge },
  button: {
    width: '50%',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});
