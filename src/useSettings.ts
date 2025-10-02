import { useEffect, useState } from 'react';
import RNFS, { DocumentDirectoryPath } from 'react-native-fs';
import { getDataFile } from './utils';

const path = `${DocumentDirectoryPath}/settings.json`;

export enum mode {
  InputWord,
  MultipleChoise,
}

export interface Statistics {
  rightWordsCount: number;
  wrongWordsCount: number;
  wordsHaveZeroFrequencyCount: number;
}

export interface AppSettings {
  mode: mode;
  showRandomlyTranslation: boolean;
}

const standardSettings = {
  mode: mode.MultipleChoise,
  showRandomlyTranslation: false,
};

export default function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(standardSettings);

  useEffect(() => {
    getDataFile<AppSettings>(path, standardSettings).then(data => {
      if (data) setSettings(data);
    });
  }, []);

  useEffect(() => {
    if (settings) RNFS.writeFile(path, JSON.stringify(settings), 'utf8');
  }, [settings]);

  function toggleInputMode() {
    if (settings)
      setSettings(prev => ({
        ...prev,
        mode:
          settings?.mode === mode.InputWord
            ? mode.MultipleChoise
            : mode.InputWord,
      }));
  }

  function toggleShowRandomlyTranslation() {
    if (settings)
      setSettings(prev => ({
        ...prev,
        showRandomlyTranslation: !settings.showRandomlyTranslation,
      }));
  }

  return {
    settings,
    toggleInputMode,
    toggleShowRandomlyTranslation,
  };
}
