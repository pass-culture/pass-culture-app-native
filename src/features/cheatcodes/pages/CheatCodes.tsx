import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CodePushButton } from '../components/CodePushButton';
import { CrashTestButton } from '../components/CrashTestButton';
import { env } from 'libs/environment';
import { RootStackParamList } from 'features/navigation/RootNavigator';

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>;

type Props = {
  navigation: CheatCodesNavigationProp;
};

export const CheatCodes: FunctionComponent<Props> = function () {
  return (
    <View>
      <CrashTestButton />
      {env.FEATURE_FLAG_CODE_PUSH && <CodePushButton />}
    </View>
  );
};
