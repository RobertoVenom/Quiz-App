import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const Question = ({ route, navigation }) => {
  const { questions, index } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuestion = questions[index];
  const { prompt, type, choices, correct } = currentQuestion;

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer!');
      return;
    }
    if (index + 1 < questions.length) {
      navigation.push('Question', { questions, index: index + 1 });
    } else {
      navigation.navigate('Summary', { questions });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{prompt}</Text>
      <ButtonGroup
        buttons={choices}
        selectedIndex={selectedAnswer}
        onPress={handleAnswerSelect}
        vertical
        testID="choices"
      />
      <Button title="Next Question" onPress={handleNextQuestion} testID="next-question" />
    </View>
  );
};

export default Question;
