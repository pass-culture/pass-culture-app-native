import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  onPressOption: (optionKey: string) => void
  optionKey: string
  label: string
  selected: boolean
}

export const AddressOption = ({ optionKey, label, onPressOption, selected }: Props) => {
  return (
    <React.Fragment>
      <StyledTouchableOpacity
        onPress={() => onPressOption(optionKey)}
        activeOpacity={ACTIVE_OPACITY}>
        <TextContainer>
          <StyledBody selected={selected}>{label}</StyledBody>
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
