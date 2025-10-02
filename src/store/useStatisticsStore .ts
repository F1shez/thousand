import { DocumentDirectoryPath, writeFile } from 'react-native-fs';
import { create } from 'zustand';
import { getDataFile } from '../utils';

const path = `${DocumentDirectoryPath}/statistics.json`;

export interface Statistics {
  totalRightWords: number;
  totalWrongWords: number;
}

interface StatisticsState extends Statistics {
  sessionRightWords: number;
  sessionWrongWords: number;
  wordsHaveFrequencyZero: number;

  addRightWord: () => void;
  addWrongWord: () => void;
  setFrequencyCount: (count: number) => void;
  loadStatisticsFromFile: () => void;
}

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  totalRightWords: 0,
  totalWrongWords: 0,
  sessionRightWords: 0,
  sessionWrongWords: 0,
  wordsHaveFrequencyZero: 0,

  addRightWord: () => {
    set(state => ({
      totalRightWords: state.totalRightWords + 1,
      sessionRightWords: state.sessionRightWords + 1,
    }));
    const { totalRightWords, totalWrongWords } = get();
    writeFile(
      path,
      JSON.stringify({
        totalRightWords,
        totalWrongWords,
      }),
      'utf8',
    );
  },

  addWrongWord: () => {
    set(state => ({
      totalWrongWords: state.totalWrongWords + 1,
      sessionWrongWords: state.sessionWrongWords + 1,
    }));
    const { totalRightWords, totalWrongWords } = get();
    writeFile(
      path,
      JSON.stringify({
        totalRightWords,
        totalWrongWords,
      }),
      'utf8',
    );
  },

  setFrequencyCount: (count: number) => {
    set({
      wordsHaveFrequencyZero: count,
    });
  },

  loadStatisticsFromFile: async () => {
    const data = await getDataFile<Statistics>(path, {
      totalRightWords: 0,
      totalWrongWords: 0,
    });
    if (data) {
      set({
        totalRightWords: data.totalRightWords ?? 0,
        totalWrongWords: data.totalWrongWords ?? 0,
      });
    }
  },
}));
