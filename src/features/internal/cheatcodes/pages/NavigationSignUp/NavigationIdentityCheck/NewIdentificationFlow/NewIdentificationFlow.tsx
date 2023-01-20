import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NewIdentificationFlow(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <ScrollView>
      <PageHeaderSecondary title="NewIdentificationFlow 🎨" />
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
        <LinkToComponent
          name="SelectPhoneStatus"
          title="SelectPhoneStatus"
          onPress={() => navigate('SelectPhoneStatus')}
        />
        <LinkToComponent
          name="DMSIntroduction"
          title="DMS FR"
          onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
        />
        <LinkToComponent
          name="DMSIntroduction"
          title="DMS ETR"
          onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
        />
        <LinkToComponent
          name="ExpiredOrLostID"
          title="ExpiredOrLostID"
          onPress={() => navigate('ExpiredOrLostID')}
        />
        <LinkToComponent name="ComeBackLater" title="Reviens plus tard" />
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
