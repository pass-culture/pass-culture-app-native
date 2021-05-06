import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { IdCheckWeb } from 'features/idcheck/IdCheckWeb'
import { RootStackParamList } from 'features/navigation/RootNavigator'

type Props = StackScreenProps<RootStackParamList, 'IdCheckWebView'>

export const IdCheckWebView: React.FC<Props> = function (props) {
  const { email, licenceToken } = props.route.params
  return <IdCheckWeb email={email} licenceToken={licenceToken} />
}
