import React from 'react'; // @storybook
import { View } from 'react-native';

const configure = jest.fn();
const getStorybookUI = jest.fn().mockImplementation(() => () => <View />);

export { configure, getStorybookUI };
