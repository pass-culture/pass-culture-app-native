import { IdCheckError, IdCheckErrors, useIdCheckContext } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { useNotifyIdCheckCompleted } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationIdCheckErrors(): JSX.Element {
  const { replace } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('Navigation', undefined)
  const [error, setError] = useState<IdCheckError | Error | null>(null)
  const { setContextValue } = useIdCheckContext()
  const { data: settings } = useAppSettings()
  const queryClient = useQueryClient()
  const { mutate: notifyIdCheckCompleted } = useNotifyIdCheckCompleted({
    onSuccess: syncUserAndProceedToNextScreen,
    onError: syncUserAndProceedToNextScreen,
  })

  const { refetch } = useUserProfileInfo({
    cacheTime: 0,
  })

  function goToBeneficiaryRequestSent() {
    replace('BeneficiaryRequestSent')
  }

  function onAbandon() {
    replace(...homeNavigateConfig)
  }

  function syncUserAndProceedToNextScreen() {
    queryClient.invalidateQueries(QueryKeys.USER_PROFILE).finally(() => {
      refetch().finally(goToBeneficiaryRequestSent)
    })
  }

  function onSuccess() {
    notifyIdCheckCompleted()
  }

  useEffect(() => {
    if (setContextValue) {
      setContextValue({
        onAbandon,
        onSuccess,
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
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
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
