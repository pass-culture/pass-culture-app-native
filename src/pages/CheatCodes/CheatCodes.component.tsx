import React, { FunctionComponent } from 'react';
import { View, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { t } from '@lingui/macro';

import { CodePushButton } from './components/CodePushButton';
import { CrashTestButton } from './components/CrashTestButton';
import { ChangeLanguage } from './components/ChangeLanguage';
import { env } from '../../environment';
import { RootStackParamList } from '../../navigation';
import { i18n } from '../../lib/i18n';

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>;

type Props = {
  navigation: CheatCodesNavigationProp;
};
export const CheatCodes: FunctionComponent<Props> = ({ navigation }) => (
  <View>
    <CrashTestButton />
    <ChangeLanguage
      onLanguageChange={() =>
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Login' }],
          })
        )
      }
    />
    {env.FEATURE_FLAG_CODE_PUSH && <CodePushButton />}
    {/* @storybook */}
    <Button
      onPress={() => navigation.navigate('Storybook')}
      title={i18n._(/*i18n: Title of the button to go to storybook*/ t`Go to storybook`)}
    ></Button>
  </View>
);
