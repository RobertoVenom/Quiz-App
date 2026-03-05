import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, View, Button, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ButtonGroup } from 'react-native-elements';

const Stack = createStackNavigator();

// sample questions (correct answers in comments below)
const sampleQuestions = [
  {
    prompt: 'This is the question...',
    type: 'multiple-choice',
    choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
    correct: 0, // correct: choice 1
  },
  {
    prompt: 'This is another  question...',
    type: 'multiple-answer',
    choices: ['choice 1', 'choice 2', 'choice 3', 'choice 4'],
    correct: [0, 2], // correct: choice 1 and choice 3
  },
  {
    prompt: 'This is the third question...',
    type: 'true-false',
    choices: ['choice 1', 'choice 2'],
    correct: 1, // correct: choice 2 (false)
  },
];

export function Question({ navigation, route }) {
  const { data, index, answers = [] } = route.params;
  const q = data[index];
  const [selected, setSelected] = useState(
    q.type === 'multiple-answer' ? [] : -1
  );

  const onPressChoice = (value) => {
    if (q.type === 'multiple-answer') {
      // toggle
      const set = new Set(selected);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      setSelected(Array.from(set));
    } else {
      setSelected(value);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (index + 1 < data.length) {
      navigation.replace('Question', {
        data,
        index: index + 1,
        answers: newAnswers,
      });
    } else {
      navigation.replace('Summary', { data, answers: newAnswers });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{q.prompt}</Text>
      <ButtonGroup
        buttons={q.choices}
        selectedIndex={
          q.type === 'multiple-answer' ? undefined : selected
        }
        selectMultiple={q.type === 'multiple-answer'}
        onPress={onPressChoice}
        vertical
        testID="choices"
      />
      <Button
        title={index + 1 < data.length ? 'Next Question' : 'Finish'}
        onPress={handleNext}
        disabled={
          q.type === 'multiple-answer'
            ? selected.length === 0
            : selected === -1
        }
        testID="next-question"
      />
    </View>
  );
}

export function Summary({ navigation, route }) {
  const { data, answers } = route.params;
  let score = 0;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.score} testID="total">
        Total score: {'
'}
        {data.reduce((acc, q, idx) => {
          const correct = q.correct;
          const ans = answers[idx];
          let isCorrect = false;
          if (Array.isArray(correct)) {
            isCorrect =
              Array.isArray(ans) &&
              correct.length === ans.length &&
              correct.every((v) => ans.includes(v));
          } else {
            isCorrect = ans === correct;
          }
          if (isCorrect) acc++;
          return acc;
        }, 0)}
      </Text>
      {data.map((q, idx) => {
        const ans = answers[idx];
        const correct = q.correct;
        let isCorrect = false;
        if (Array.isArray(correct)) {
          isCorrect =
            Array.isArray(ans) &&
            correct.length === ans.length &&
            correct.every((v) => ans.includes(v));
        } else {
          isCorrect = ans === correct;
        }
        return (
          <View key={idx} style={styles.questionBlock}>
            <Text style={styles.prompt}>{q.prompt}</Text>
            {q.choices.map((choice, cidx) => {
              const chosen = Array.isArray(ans)
                ? ans.includes(cidx)
                : ans === cidx;
              const shouldStrike = chosen && !((Array.isArray(correct) ? correct.includes(cidx) : correct === cidx));
              const isBold = (Array.isArray(correct) ? correct.includes(cidx) : correct === cidx);
              return (
                <Text
                  key={cidx}
                  style={[
                    styles.choiceText,
                    isBold && styles.bold,
                    shouldStrike && styles.strike,
                  ]}
                >
                  {choice}
                </Text>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Question">
        <Stack.Screen
          name="Question"
          component={Question}
          initialParams={{ data: sampleQuestions, index: 0 }}
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
  prompt: {
    fontSize: 18,
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  questionBlock: {
    marginBottom: 16,
  },
  choiceText: {
    fontSize: 16,
    marginLeft: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
});

export default App;
