import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import {
  RootScreenNames,
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { padding } from 'ui/theme'

interface LinkToComponentProps {
  name?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
  disabled?: boolean
}

export const LinkToComponent = ({
  name = 'CheatcodesNavigationSignUp',
  onPress,
  title,
  navigationParams,
  disabled = false,
}: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

  return (
    <Row>
      <ButtonPrimary
        wording={title ?? name}
        onPress={onPress ?? navigateToComponent}
        disabled={disabled}
      />
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
