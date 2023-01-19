import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { Row } from 'features/internal/cheatcodes/components/Row'
import {
  RootScreenNames,
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

interface LinkToComponentProps {
  name?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
}

export const LinkToComponent = ({
  name = 'NavigationSignUp',
  onPress,
  title,
  navigationParams,
}: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

  return (
    <Row half>
      <ButtonPrimary wording={title ?? name} onPress={onPress ?? navigateToComponent} />
    </Row>
  )
}
