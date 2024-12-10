import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import RNFS, { DocumentDirectoryPath, exists } from "react-native-fs";
import translationData from "./translations.json";

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

      const readJsonFile = async () => {
        try {
          const jsonString = await RNFS.readFile(path, "utf8");
          const jsonData = JSON.parse(jsonString);
          setWordsArray(jsonData);
          generateWeightedArray(jsonData);
          console.log(jsonData);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };

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
      return;
    }
    console.log(curentWord);
    console.log(userWord);
    let isRight = false;

    curentWord.translations.forEach((translation) => {
      if (userWord.toLowerCase() === translation.toLowerCase()) {
        console.log("success");
        setRightWord(curentWord.word);
        isRight = true;
      }
    });
    if (!isRight) {
      console.log("fail");
      Alert.alert("Ошибка!", "Правильные слова: " + curentWord.translations);
      setWrongWord(curentWord.word);
    }
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

  return { getRandomWord, checkTranslateWord };
}
