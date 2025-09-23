import { OutputWord } from "./src/components/OutputWord";
import { Animated, Button, StyleSheet } from "react-native";
import { InputWord } from "./src/components/InputWord";
import React, { useState, useEffect, useRef } from "react";
import useTranslationTrainer from "./src/useTranslationTrainer";
import { Settings } from "./src/components/Settings";
import Toast from "react-native-toast-message";
import './global.css';


export default function App() {
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const callCount = useRef(0);
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const {
    getRandomWord,
    checkTranslateWord,
    resetFrequencyJson,
    saveFrequencyJson,
  } = useTranslationTrainer();

  useEffect(() => {
    const word = getRandomWord();
    setRandomWord(word);
  }, [getRandomWord]);

  function handleCheckWord(word: string) {
    const isCorrect = checkTranslateWord(word);

    Animated.sequence([
      Animated.timing(backgroundAnim, {
        toValue: isCorrect ? 1 : -1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Периодически сохраняем текущие веса повторений слов
    if (callCount.current === 5) {
      saveFrequencyJson();
      callCount.current = 0;
    } else {
      callCount.current++;
    }
  }

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#ffb3b3", "#fff", "#90ee90"], // красный → белый → зелёный
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Button
        title="settings"
        onPress={() => {
          setShowSettings(true);
        }}
      />
      {randomWord ? <OutputWord word={randomWord} /> : null}
      <InputWord callback={handleCheckWord} />
      {showSettings && (
        <Settings
          setShowSettings={setShowSettings}
          resetFrequency={resetFrequencyJson}
        />
      )}
      <Toast />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

