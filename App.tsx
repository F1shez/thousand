import { OutputWord } from './src/components/OutputWord';
import {
  Animated,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { InputWord } from './src/components/InputWord';
import React, { useState, useEffect, useRef } from 'react';
import useTranslationTrainer from './src/useTranslationTrainer';
import { Settings } from './src/components/Settings';
import Toast from 'react-native-toast-message';

import { Settings as SettingsIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { S } from './constants/spacing';
import { InfoBar } from './src/components/InfoBar';

export default function App() {
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const callCount = useRef(0);
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const [behaviour, setBehaviour] = useState<'padding' | undefined>('padding');
  const [rightWordsCount, setRightWordsCount] = useState<number>(0);
  const [wrongWordsCount, setWrongWordsCount] = useState<number>(0);

  const {
    getRandomWord,
    checkTranslateWord,
    resetFrequencyJson,
    saveFrequencyJson,
  } = useTranslationTrainer();

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setBehaviour('padding');
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    const word = getRandomWord();
    setRandomWord(word);
  }, [getRandomWord]);

  function handleCheckWord(word: string) {
    const isCorrect = checkTranslateWord(word);
    if (isCorrect) setRightWordsCount(rightWordsCount + 1);
    else setWrongWordsCount(wrongWordsCount + 1);

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
    outputRange: ['#ffb3b3', '#fff', '#90ee90'], // красный → белый → зелёный
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? behaviour : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[styles.body, { backgroundColor }]}>
          <InfoBar
            rightWordsCount={rightWordsCount}
            wrongWordsCount={wrongWordsCount}
          />
          <TouchableOpacity
            onPress={() => {
              setShowSettings(true);
            }}
            style={[styles.settingsButton]}
          >
            <SettingsIcon color="black" size={24} />
          </TouchableOpacity>
          {randomWord ? <OutputWord word={randomWord} /> : null}
          <InputWord callback={handleCheckWord} />
          {showSettings ? (
            <Settings
              setShowSettings={setShowSettings}
              resetFrequency={resetFrequencyJson}
            />
          ) : null}
          <Toast />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: S.xsmall,
    right: S.xsmall,
  },
});
