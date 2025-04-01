import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Sample questions data
const data = [
  {
    prompt: "This is the question...",
    type: "multiple-choice",
    choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
    correct: 0, // correct answer index
  },
  {
    prompt: "This is another question...",
    type: "multiple-answer",
    choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
    correct: [0, 2], // correct answer indexes
  },
  {
    prompt: "This is the third question...",
    type: "true-false",
    choices: ["choice 1", "choice 2"], // choice 1 = True, choice 2 = False
    correct: 1, // correct answer index (1 = False)
  },
];

// Question Component
function Question({ route, navigation }) {
  const { questions, currentIndex } = route.params;
  const question = questions[currentIndex];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      navigation.navigate('Question', { currentIndex: currentIndex + 1, questions });
    } else {
      navigation.navigate('Summary', { questions, answers: selectedIndex });
    }
  };

  const isMultipleChoice = question.type === 'multiple-choice';
  const isMultipleAnswer = question.type === 'multiple-answer';
  const isTrueFalse = question.type === 'true-false';

  return (
    <View style={styles.container}>
      <Text>{question.prompt}</Text>
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={question.choices}
        containerStyle={{ height: 200 }}
        testID="choices"
        vertical
      />
      <Button
        title="Next Question"
        onPress={handleNextQuestion}
        testID="next-question"
      />
    </View>
  );
}

// Summary Component
function Summary({ route }) {
  const { questions, answers } = route.params;
  const [score, setScore] = useState(0);

  const calculateScore = () => {
    let totalScore = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (Array.isArray(question.correct)) {
        if (JSON.stringify(question.correct.sort()) === JSON.stringify(answer.sort())) {
          totalScore += 1;
        }
      } else if (question.correct === answer) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
  };

  const renderQuestionSummary = (question, index) => {
    const userAnswer = answers[index];
    const correctAnswer = question.correct;
    const isMultipleAnswer = Array.isArray(correctAnswer);

    return (
      <View key={index}>
        <Text>{question.prompt}</Text>
        {question.choices.map((choice, choiceIndex) => {
          const isSelected = isMultipleAnswer
            ? userAnswer.includes(choiceIndex)
            : userAnswer === choiceIndex;
          const isCorrect = isMultipleAnswer
            ? correctAnswer.includes(choiceIndex)
            : correctAnswer === choiceIndex;

          const style = isSelected
            ? isCorrect
              ? { fontWeight: 'bold' }
              : { textDecorationLine: 'line-through' }
            : {};

          return (
            <Text key={choiceIndex} style={style}>
              {choice}
            </Text>
          );
        })}
      </View>
    );
  };

  // Calculate score on initial render
  React.useEffect(() => {
    calculateScore();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>Total Score: {score} / {questions.length}</Text>
      {questions.map((question, index) => renderQuestionSummary(question, index))}
    </ScrollView>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{ questions: data, currentIndex: 0 }}
        />
        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
