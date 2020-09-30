import React, { FunctionComponent } from 'react'; // @storybook
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const CenterView: FunctionComponent = ({ children }) => (
  <View style={styles.main}>{children}</View>
);
