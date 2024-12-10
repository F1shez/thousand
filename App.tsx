import { OutputWord } from './src/components/OutputWord';
import { StyleSheet, View, Alert } from 'react-native';
import { InputWord } from './src/components/InputWord';
import React, { useState, useEffect } from 'react';
import { DocumentDirectoryPath, readFile } from 'react-native-fs';
import useTranslationTrainer, { WordItem } from './src/useTranslationTrainer';

export default function App() {

  const [randomWord, setRandomWord] = useState<string | null>(null);
  const { getRandomWord, checkTranslateWord } = useTranslationTrainer();


  useEffect(() => {
    const word = getRandomWord();
    setRandomWord(word);
  }, [getRandomWord]);

  return (
    <View style={styles.container}>
      {randomWord ? <OutputWord word={randomWord} /> : null}
      <InputWord callback={checkTranslateWord} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


