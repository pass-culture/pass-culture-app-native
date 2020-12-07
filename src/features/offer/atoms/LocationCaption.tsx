import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Digital } from 'ui/svg/icons/Digital'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  locationName?: string | null
  where?: string | null
  isDigital: boolean
}

export const LocationCaption: FunctionComponent<Props> = ({
  locationName,
  where,
  isDigital,
}: Props) => (
  <LocationContainer>
    <StyledView>
      <IconContainer>
        {isDigital ? <Digital size={getSpacing(4)} /> : <LocationPointer size={getSpacing(4)} />}
      </IconContainer>
      {locationName && <StyledText numberOfLines={1}>{`${locationName}, `}</StyledText>}
    </StyledView>
    {where && (
      <WhereText numberOfLines={1} isDigital={isDigital}>
        {where}
      </WhereText>
    )}
  </LocationContainer>
)

const LocationContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
})

const IconContainer = styled.View({
  marginRight: getSpacing(1),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
  textTransform: 'capitalize',
})

const WhereText = styled(Typo.Caption)<{ isDigital: boolean }>(({ isDigital }) => ({
  textTransform: isDigital ? 'none' : 'capitalize',
}))

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
