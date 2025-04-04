import React from 'react';
import { View, Text } from 'react-native';

const Summary = ({ route }) => {
  const { questions } = route.params;
  let score = 0;

  return (
    <View style={{ padding: 20 }}>
      <Text>Total Score: {score} / {questions.length}</Text>
      {questions.map((question, index) => {
        const { prompt, choices, correct } = question;
        let isCorrect = false;

        if (Array.isArray(correct)) {
          isCorrect = correct.every((index) => selectedAnswer === index);
        } else {
          isCorrect = selectedAnswer === correct;
        }

        // Calculate score
        if (isCorrect) score++;

        return (
          <View key={index}>
            <Text>{prompt}</Text>
            <Text>
              Correct Answer(s):{' '}
              {correct.map((answerIndex) => (
                <Text key={answerIndex} style={{ fontWeight: 'bold' }}>
                  {choices[answerIndex]}
                </Text>
              ))}
            </Text>
            <Text style={isCorrect ? { color: 'green' } : { color: 'red' }}>
              Your Answer: {choices[selectedAnswer]} - {isCorrect ? 'Correct' : 'Incorrect'}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default Summary;
