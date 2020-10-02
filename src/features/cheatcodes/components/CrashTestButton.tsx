import React from 'react';
import { Button } from 'react-native';

export const CrashTestButton = () => (
  <Button
    testID="crashTestButton"
    title="Crash the app"
    onPress={() => {
      throw new Error('Test crash');
    }}
  />
);
