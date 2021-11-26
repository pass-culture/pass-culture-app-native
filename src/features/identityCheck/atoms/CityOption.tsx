import React from 'react'
import styled from 'styled-components/native'

import { SuggestedCity } from 'libs/place'
import { Separator } from 'ui/components/Separator'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  onPressOption: (option: SuggestedCity ) => void
  option: SuggestedCity
  selected: boolean
}

export const CityOption = ({ option, onPressOption, selected }: Props) => {
  return (
    <React.Fragment>
      <StyledTouchableOpacity onPress={() => onPressOption(option)} activeOpacity={ACTIVE_OPACITY}>
        <TextContainer>
          <StyledBody selected={selected}>{option.name}</StyledBody>
          {selected ? (
            <IconContainer>
              <Validate color={ColorsEnum.PRIMARY} />
            </IconContainer>
          ) : null}
        </TextContainer>
      </StyledTouchableOpacity>
      <Separator />
    </React.Fragment>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: getSpacing(3),
})
const TextContainer = styled.View({
  flex: 1,
  justifyContent: 'center',
})

const StyledBody = styled(Typo.Body)<{ selected: boolean }>(({ selected }) => ({
  fontWeight: selected ? 'bold' : 'normal',
}))

const IconContainer = styled.View({
  position: 'absolute',
  right: 0,
})
