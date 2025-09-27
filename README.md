# Thousand: Learn English Efficiently

**Thousand** is a simple project aimed at enhancing English vocabulary through the study of the 1000 most frequently used English words. This approach enables understanding of most basic texts.

### Project Highlights:

- **Platform:** Built with React Native for cross-platform mobile development.
- **Translation:** Utilizes Yandex.Dictionary API for word translations.
- **Current Status:** Fully operational on Android with plans for expansion.

### Upcoming Features:

- [*] Implement **fuzzy wuzzy** for more accurate translation checks.
- [*] Add **settings** for user customization.
- [*] Implement **save** and **reset** options for word frequency arrays.
- [ ] Add and edit word arrays.

## Main Algorithm:

- **Word Frequency Adjustment:** Words guessed correctly will appear less frequently, while incorrectly guessed words will appear more often.

### Getting Started

> **Note**: Ensure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) up to "Creating a new application" before proceeding.

#### Step 1: Start the Metro Server

First, you need to start **Metro**, the JavaScript bundler included with React Native:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

#### Step 2: Start Your Application

**Keep Metro running in its own terminal.** Open a new terminal from your project's root to:

##### For Android:

```bash
# Using npm
npm run android

# OR using Yarn
yarn android
```

##### For iOS:

```bash
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is configured correctly, you should see your app running in your **Android Emulator** or **iOS Simulator** shortly, assuming correct setup of your emulator/simulator.

**Alternative:** You can also run the app directly from Android Studio or Xcode for a more integrated development experience.


Идеи: 
Показывать процент правильных ответов, 
При правильном ответе подсвечивать зеленным фон,