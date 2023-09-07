import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Tutorial } from 'features/tutorial/enums'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationProfileTutorial(): React.JSX.Element {
  return (
    <ScrollView>
      <PageHeaderSecondary title="Tutoriel profil" />
      <StyledContainer>
        <LinkToComponent
          name="AgeSelection"
          navigationParams={{ type: Tutorial.PROFILE_TUTORIAL }}
        />
        <LinkToComponent
          name="AgeSelectionOther"
          navigationParams={{ type: Tutorial.PROFILE_TUTORIAL }}
        />
        <LinkToComponent
          name="ProfileTutorialAgeInformation"
          title="Page 15 ans"
          navigationParams={{ selectedAge: 15 }}
        />
        <LinkToComponent
          name="ProfileTutorialAgeInformation"
          title="Page 16 ans"
          navigationParams={{ selectedAge: 16 }}
        />
        <LinkToComponent
          name="ProfileTutorialAgeInformation"
          title="Page 17 ans"
          navigationParams={{ selectedAge: 17 }}
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
