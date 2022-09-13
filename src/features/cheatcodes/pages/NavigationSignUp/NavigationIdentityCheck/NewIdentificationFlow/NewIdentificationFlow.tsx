import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Spacer } from 'ui/theme'

export function NewIdentificationFlow(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="NewIdentificationFlow 🎨"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <LinkToComponent
          name="SelectIDOrigin"
          title="SelectIDOrigin"
          onPress={() => navigate('SelectIDOrigin')}
        />
        <LinkToComponent
          name="SelectIDStatus"
          title="SelectIDStatus"
          onPress={() => navigate('SelectIDStatus')}
        />
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
