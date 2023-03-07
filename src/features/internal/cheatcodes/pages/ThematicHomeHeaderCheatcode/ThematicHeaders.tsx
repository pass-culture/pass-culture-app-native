import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Spacer } from 'ui/theme'

export const ThematicHeaders = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledContainer>
        <LinkToComponent
          title={'Highlight'}
          onPress={() => navigate('HighlightThematicHomeHeaderCheatcode')}
        />
        <LinkToComponent
          title={'Default'}
          onPress={() => navigate('DefaultThematicHomeHeaderCheatcode')}
        />
        <LinkToComponent
          title={'Category'}
          onPress={() => navigate('CategoryThematicHomeHeaderCheatcode')}
        />
      </StyledContainer>
    </React.Fragment>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
