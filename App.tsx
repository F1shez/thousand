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
import useTranslationTrainer, {
  WeightedArrayItem,
} from './src/hooks/useTranslationTrainer';
import { Settings } from './src/components/Settings';

import { Settings as SettingsIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { S } from './constants/spacing';
import { InfoBar } from './src/components/InfoBar';
import { MultipleChoice } from './src/components/MultipleChoice';
import { getRandomItem } from './src/utils';
import useSettings, { mode } from './src/useSettings';
import { useNotification } from './src/hooks/useNotification';
import { useStatisticsStore } from './src/store/useStatisticsStore ';

export default function App() {
  useNotification(20, 0);

  const [randomWord, setRandomWord] = useState<WeightedArrayItem | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const callCount = useRef(0);
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const [behaviour, setBehaviour] = useState<'padding' | undefined>('padding');

  const { addRightWord, addWrongWord, loadStatisticsFromFile } =
    useStatisticsStore();

  const { settings, toggleInputMode, toggleShowRandomlyTranslation } =
    useSettings();

  const {
    getRandomWord,
    checkTranslateWord,
    resetFrequencyJson,
    saveFrequencyJson,
    getRandomTranslation,
  } = useTranslationTrainer({ settings });

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
    loadStatisticsFromFile();
  }, [loadStatisticsFromFile]);

  useEffect(() => {
    const word = getRandomWord();
    setRandomWord(word);
  }, [getRandomWord]);

  function handleCheckWord(word: string) {
    const isCorrect = checkTranslateWord(word);
    if (isCorrect) addRightWord();
    else addWrongWord();

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

    // Periodically save the current frequency words
    if (callCount.current === 5) {
      saveFrequencyJson();
      callCount.current = 0;
    } else {
      callCount.current++;
    }
  }

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['#ffb3b3', '#fff', '#90ee90'], // red → white → green
  });

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'android' ? behaviour : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View style={[styles.body, { backgroundColor }]}>
            <InfoBar />
            <TouchableOpacity
              onPress={() => {
                setShowSettings(true);
              }}
              style={[styles.settingsButton]}
            >
              <SettingsIcon color="black" size={24} />
            </TouchableOpacity>
            {randomWord ? <OutputWord word={randomWord.word} /> : null}
            {randomWord ? (
              <>
                {settings?.mode === mode.InputWord ? (
                  <InputWord callback={handleCheckWord} />
                ) : null}
                {settings?.mode === mode.MultipleChoise ? (
                  <MultipleChoice
                    callback={handleCheckWord}
                    getRandomTranslation={getRandomTranslation}
                    rightTranslation={
                      settings.showRandomlyTranslation
                        ? getRandomItem(randomWord.translations)
                        : randomWord.translations[0]
                    }
                  />
                ) : null}
              </>
            ) : null}
            {showSettings && settings ? (
              <Settings
                settings={settings}
                toggleInputMode={toggleInputMode}
                toggleShowRandomlyTranslation={toggleShowRandomlyTranslation}
                setShowSettings={setShowSettings}
                resetFrequency={resetFrequencyJson}
              />
            ) : null}
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
