import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationTutorial(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <ScrollView>
      <PageHeaderSecondary title="Tutorial ❔" />
      <StyledContainer>
        <LinkToComponent title="Onboarding  🛶" onPress={() => navigate('NavigationOnboarding')} />
        <LinkToComponent
          title="ProfileTutorial 👤"
          onPress={() => navigate('NavigationProfileTutorial')}
        />
        <LinkToComponent
          title="FirestTutorial [DEPRECATED]"
          onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
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
