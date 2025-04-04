// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Question from './src/components/Question';
import Summary from './src/components/Summary';

// Example JSON data for quiz questions
const questions = [
  {
    prompt: 'This is the question...',
    type: 'multiple-choice',
    choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
    correct: 0, // Correct answer index
  },
  {
    prompt: 'This is another question...',
    type: 'multiple-answer',
    choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
    correct: [0, 2], // Correct answer indices
  },
  {
    prompt: 'This is the third question...',
    type: 'true-false',
    choices: ['choice 1', 'choice 2'],
    correct: 1, // Correct answer index
  },
];

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen name="Question">
          {(props) => <Question {...props} questions={questions} index={0} />}
        </Stack.Screen>
        <Stack.Screen name="Summary">
          {(props) => <Summary {...props} questions={questions} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
