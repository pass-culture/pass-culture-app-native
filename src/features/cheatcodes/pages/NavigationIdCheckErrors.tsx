import { IdCheckError, IdCheckErrors, useIdCheckContext } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationIdCheckErrors(): JSX.Element {
  const navigation = useNavigation<UseNavigationType>()
  const [error, setError] = useState<IdCheckError | Error | null>(null)
  const { setContextValue } = useIdCheckContext()
  const { data: settings } = useAppSettings()

  useEffect(() => {
    if (setContextValue) {
      setContextValue({
        displayDmsRedirection: !!settings?.displayDmsRedirection,
      })
    }
  }, [setContextValue])

  if (error) {
    throw error
  }

  function enumKeys<O extends Record<string, unknown>, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[]
  }

  const links = []
  for (const value of enumKeys(IdCheckErrors)) {
    links.push(IdCheckErrors[value])
  }

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="Id Check v2 Errors"
        leftIcon={ArrowPrevious}
        onLeftIconPress={navigation.goBack}
      />
      <StyledContainer>
        <Row half>
          <NavigationButton
            title="generic"
            onPress={() => setError(new Error('We use a generic message so none will see this'))}
          />
        </Row>
        {links.map((link) => (
          <Row half key={link}>
            <NavigationButton
              title={link}
              onPress={() => setError(new IdCheckError(IdCheckErrors[link]))}
            />
          </Row>
        ))}
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const NavigationButton = styled(ButtonPrimary).attrs({
  textSize: 11.5,
})({})

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
