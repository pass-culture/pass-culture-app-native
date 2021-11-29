import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  onPressOption: (option: string) => void
  option: string
  selected: boolean
}

export const AddressOption = ({ option, onPressOption, selected }: Props) => {
  return (
    <Container>
      <StyledTouchableOpacity onPress={() => onPressOption(option)} activeOpacity={ACTIVE_OPACITY}>
        <TextContainer>
          <StyledBody selected={selected}>{option}</StyledBody>
          {selected ? (
            <IconContainer>
              <Validate color={ColorsEnum.PRIMARY} />
            </IconContainer>
          ) : null}
        </TextContainer>
      </StyledTouchableOpacity>
      <Separator />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(4),
})

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
