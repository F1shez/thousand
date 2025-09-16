import { useState, useEffect, useCallback } from "react";
import { Alert, ToastAndroid } from "react-native";
import RNFS, { DocumentDirectoryPath, exists } from "react-native-fs";
import translationData from "./translations.json";
import { ratio } from "fuzzball";
import Toast from "react-native-toast-message";

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

  useEffect(() => {
    exists(path).then(async (exist) => {
      if (!exist) {
        await RNFS.writeFile(path, JSON.stringify(translationData), "utf8");
      }

      readJsonFile();
    });
  }, []);

  function setRightWord(word: string) {
    for (let i = 0; i < wordsArray.length; i++) {
      if (wordsArray[i].word === word) {
        wordsArray.splice(i, 1, {
          word: weightedArray[i].word,
          translations: weightedArray[i].translations,
          frequency: wordsArray[i].frequency - 1,
        });
      }
    }
    generateWeightedArray(wordsArray);
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
          translation.toLowerCase()
        );
        if (ratioValue > 86 && acc.ratioValue < ratioValue) {
          acc.ratioValue = ratioValue;
          acc.rightWord = curentWord.word;
        }
        return acc;
      },
      { ratioValue: 0, rightWord: "" }
    );

    if (findedTranslateWord.rightWord === "") {
      Toast.show({
        type: "error",
        text1: "Правильные слова:",
        text2: curentWord.translations.join(", ")
      });
      setWrongWord(curentWord.word);
      return false;
    }
    Toast.show({
        type: "success",
        text1: "Правильно, другие переводы:",
        text2: curentWord.translations.join(", ")
      });
    setRightWord(curentWord.word);
    return true;
  }

  function generateWeightedArray(array: any[]) {
    // Вычисляем взвешенный массив
    const tempWeightedArray = array.reduce((acc: any, item: any) => {
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

  async function readJsonFile() {
    try {
      const jsonString = await RNFS.readFile(path, "utf8");
      const jsonData = JSON.parse(jsonString);
      setWordsArray(jsonData);
      generateWeightedArray(jsonData);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  async function saveFrequencyJson() {
    await RNFS.writeFile(path, JSON.stringify(wordsArray), "utf8");
  }

  async function resetFrequencyJson() {
    await RNFS.writeFile(path, JSON.stringify(translationData), "utf8");
    readJsonFile();
  }

  return {
    getRandomWord,
    checkTranslateWord,
    saveFrequencyJson,
    resetFrequencyJson,
  };
}
