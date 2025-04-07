import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Text } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import Question from './Question';
import Summary from './Summary';

const Stack = createStackNavigator();

const data = [
  {
    prompt: "This is the first question...",
    type: "multiple-choice",
    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    correct: 0,
  },
  {
    prompt: "This is the second question...",
    type: "multiple-answer",
    choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    correct: [0, 2],
  },
  {
    prompt: "This is the third question...",
    type: "true-false",
    choices: ["True", "False"],
    correct: 1,
  },
];

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const QuestionScreen = ({ navigation, route }) => {
  const { index = 0 } = route.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = data[index];

  const handleNextQuestion = () => {
    if (index + 1 < data.length) {
      navigation.navigate('Question', { index: index + 1 });
    } else {
      navigation.navigate('Summary', { answers: data });
    }
  };

  return (
    <>
      <Text>{question.prompt}</Text>
      <ButtonGroup
        onPress={(selectedIndex) => setSelectedAnswer(selectedIndex)}
        selectedIndex={selectedAnswer}
        buttons={question.choices}
        containerStyle={{ height: 200 }}
      />
      <Button testID="next-question" title="Next Question" onPress={handleNextQuestion} />
    </>
  );
};

const Summary = ({ route }) => {
  const { answers } = route.params;
  let score = 0;

  const renderAnswers = (question, idx) => {
    let userAnswer = question.userAnswer;
    let correctAnswer = question.correct;

    if (Array.isArray(correctAnswer)) {
      correctAnswer = correctAnswer.sort().join(',');
    }

    let isCorrect = userAnswer && userAnswer === correctAnswer;
    return (
      <Text key={idx}>
        {question.prompt} 
        {"\n"}
        {question.choices.map((choice, idx) => {
          const isSelected = userAnswer.includes(idx);
          const isCorrectChoice = correctAnswer.includes(idx);
          return (
            <Text
              key={idx}
              style={{
                fontWeight: isSelected && isCorrectChoice ? 'bold' : 'normal',
                textDecorationLine: !isCorrectChoice ? 'line-through' : 'none',
              }}>
              {choice}
            </Text>
          );
        })}
        {"\n"}
        <Text>{isCorrect ? "Correct!" : "Incorrect"}</Text>
      </Text>
    );
  };

  return (
    <>
      <Text testID="total">Score: {score}</Text>
      {answers.map((question, idx) => renderAnswers(question, idx))}
    </>
  );
};

export default App;
