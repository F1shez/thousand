import { useState, useEffect, useCallback } from 'react';
import RNFS, { DocumentDirectoryPath, exists } from 'react-native-fs';
import translationData from './translations.json';
import { ratio } from 'fuzzball';
import { Alert } from 'react-native';

export interface WordItem {
  word: string;
  translations: string[];
  frequency: number;
}

interface WeightedArrayItem {
  word: string;
  translations: string[];
}

const path = `${DocumentDirectoryPath}/translations.json`;

export default function useTranslationTrainer() {
  const [wordsArray, setWordsArray] = useState<WordItem[]>([]);
  const [weightedArray, setWeightedArray] = useState<WeightedArrayItem[]>([]);
  const [curentWord, setCurentWord] = useState<WeightedArrayItem | null>(null);

  const readJsonFile = useCallback(async () => {
    try {
      const jsonString = await RNFS.readFile(path, 'utf8');
      const jsonData = JSON.parse(jsonString);
      setWordsArray(jsonData);
      generateWeightedArray(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }, []);

  useEffect(() => {
    exists(path).then(async exist => {
      if (!exist) {
        await RNFS.writeFile(path, JSON.stringify(translationData), 'utf8');
      }
      readJsonFile();
    });
  }, [readJsonFile]);

  function setRightWord(word: string) {
    const updated = wordsArray.map(item =>
      item.word === word
        ? {
            ...item,
            frequency: item.frequency - 1,
          }
        : item,
    );
    setWordsArray(updated);
    generateWeightedArray(updated);
  }

  function setWrongWord(word: string) {
    for (let i = 0; i < wordsArray.length; i++) {
      if (wordsArray[i].word === word) {
        wordsArray.splice(i, 1, {
          word: weightedArray[i].word,
          translations: weightedArray[i].translations,
          frequency: wordsArray[i].frequency + 1,
        });
      }
    }

    generateWeightedArray(wordsArray);
  }

  function checkTranslateWord(userWord: string) {
    if (!curentWord) {
      return false;
    }

    const findedTranslateWord = curentWord.translations.reduce(
      (acc: { rightWord: string; ratioValue: number }, translation: string) => {
        let ratioValue = ratio(
          userWord.toLowerCase(),
          translation.toLowerCase(),
        );
        if (ratioValue > 86 && acc.ratioValue < ratioValue) {
          acc.ratioValue = ratioValue;
          acc.rightWord = curentWord.word;
        }
        return acc;
      },
      { ratioValue: 0, rightWord: '' },
    );

    if (findedTranslateWord.rightWord === '') {
      Alert.alert(
        'Правильные слова:',
        curentWord.translations.join(', '),
        [
          {
            text: 'Ok',
          },
        ],
        {
          cancelable: true,
        },
      );
      setWrongWord(curentWord.word);
      return false;
    }
    setRightWord(curentWord.word);
    return true;
  }

  function generateWeightedArray(array: WordItem[]) {
    // Вычисляем взвешенный массив
    const tempWeightedArray = array.reduce<WeightedArrayItem[]>((acc, item) => {
      return acc.concat(Array(item.frequency).fill(item));
    }, []);
    setWeightedArray(tempWeightedArray);
  }

  const getRandomWord = useCallback(() => {
    if (weightedArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    setCurentWord(weightedArray[randomIndex]);
    return weightedArray[randomIndex].word;
  }, [weightedArray]);

  async function saveFrequencyJson() {
    await RNFS.writeFile(path, JSON.stringify(wordsArray), 'utf8');
  }

  async function resetFrequencyJson() {
    await RNFS.writeFile(path, JSON.stringify(translationData), 'utf8');
    readJsonFile();
  }

  return {
    getRandomWord,
    checkTranslateWord,
    saveFrequencyJson,
    resetFrequencyJson,
  };
}
