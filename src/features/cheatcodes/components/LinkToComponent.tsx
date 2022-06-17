import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import {
  RootScreenNames,
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { padding } from 'ui/theme'

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

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
