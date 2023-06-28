import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  moment: 'Maintenant' | 'Cette semaine' | 'Je suis dispo tout le temps'
  onPress: () => void
}

export const TermsOption: FunctionComponent<Props> = ({ moment, onPress }) => {
  return (
    <React.Fragment>
      <OptionContainer onPress={onPress}>
        <TextContainer>
          <Typo.ButtonText>{moment}</Typo.ButtonText>
        </TextContainer>
        <StyledArrowNext />
      </OptionContainer>
    </React.Fragment>
  )
}

const OptionContainer = styled(TouchableOpacity)(({ theme }) => ({
  height: getSpacing(20),
  flex: 1,
  margin: getSpacing(1),
  padding: getSpacing(4),
  borderRadius: theme.borderRadius.radius,
  backgroundColor: theme.colors.white,
  minHeight: 80,
  maxHeight: 80,
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: theme.colors.greyDark,
  alignItems: 'center',
}))

const TextContainer = styled.View({
  flex: 1,
})

const StyledArrowNext = styled(ArrowNext).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  size: theme.icons.sizes.smaller,
}))``
