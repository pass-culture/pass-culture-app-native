
/* eslint-disable */
// @ts-nocheck
// prettier-ignore
// doc/strangler-fig-pattern-example/ui/components/Spinner.tsx

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});
