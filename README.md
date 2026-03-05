# Quiz App

Simple React Native quiz application written according to assignment requirements.

## Features
- Navigation using React Navigation stack
- `Question` and `Summary` components exported from `App.js`
- Supports true/false, multiple choice, and multiple answer questions
- Answers selected via `ButtonGroup` from React Native Elements
- Cannot go back to previous question
- Summary displays total score and details with correct/incorrect styling

## Running

1. Install dependencies:

```bash
npm install
# or yarn
```

2. Run on Android/iOS:

```bash
npm start
npm run android
# or
npm run ios
```

## Testing

UI elements have testIDs: `choices`, `next-question`, `total`.

## Sample data

Questions and correct answers are commented in `App.js`.

## Notes

This project is a simple scaffolding; feel free to update the question data for portfolio use.