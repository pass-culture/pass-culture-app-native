import React from 'react'; // @storybook
import { Button } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { CenterView } from './CenterView';

storiesOf('Button', module)
  //@ts-ignore
  .addDecorator((getStory: () => JSX.Element) => <CenterView>{getStory()}</CenterView>)
  .add('with text', () => <Button title={'Hello Button'} onPress={action('clicked-text')} />)
  .add('with some emoji', () => <Button title={'😀 😎 👍 💯'} onPress={action('clicked-emoji')} />);
