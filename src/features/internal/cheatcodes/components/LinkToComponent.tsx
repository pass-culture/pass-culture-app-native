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
  half?: boolean
  disabled?: boolean
}

export const LinkToComponent = ({
  name = 'NavigationSignUp',
  onPress,
  title,
  navigationParams,
  half = true,
  disabled = false,
}: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

  return (
    <Row half={half}>
      <ButtonPrimary
        wording={title ?? name}
        onPress={onPress ?? navigateToComponent}
        disabled={disabled}
      />
    </Row>
  )
}
