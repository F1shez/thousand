import { useCallback, useEffect, useState } from 'react';
import RNFS, { DocumentDirectoryPath, exists } from 'react-native-fs';

const path = `${DocumentDirectoryPath}/settings.json`;

export enum mode {
  InputWord,
  MultipleChoise,
}
export interface AppSettings {
  mode: mode;
}

const standartSettings = {
  mode: mode.MultipleChoise,
};

export default function useSettings() {
  const [settings, setSettings] = useState<AppSettings>();

  const readJsonFile = useCallback(async () => {
    try {
      const jsonString = await RNFS.readFile(path, 'utf8');
      const jsonData = JSON.parse(jsonString) as AppSettings;
      setSettings(jsonData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }, []);

  useEffect(() => {
    exists(path).then(async exist => {
      if (!exist) {
        await RNFS.writeFile(path, JSON.stringify(standartSettings), 'utf8');
      }
      readJsonFile();
    });
  }, [readJsonFile]);

  useEffect(() => {
    if (settings) RNFS.writeFile(path, JSON.stringify(settings), 'utf8');
  }, [settings]);

  function toggleMode() {
    setSettings({
      mode:
        settings?.mode === mode.InputWord
          ? mode.MultipleChoise
          : mode.InputWord,
    });
  }

  return { settings, toggleMode };
}
