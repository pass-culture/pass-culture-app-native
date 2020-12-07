import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Digital } from 'ui/svg/icons/Digital'
import { PlacePointer } from 'ui/svg/icons/PlacePointer'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  placeName?: string | null
  where?: string | null
  isDigital: boolean
}

export const PlaceCaption: FunctionComponent<Props> = ({ placeName, where, isDigital }: Props) => (
  <PlaceContainer>
    <StyledView>
      <IconContainer>
        {isDigital ? <Digital size={16} /> : <PlacePointer size={16} />}
      </IconContainer>
      {placeName && <StyledText numberOfLines={1}>{`${placeName}, `}</StyledText>}
    </StyledView>
    {where && (
      <WhereText numberOfLines={1} isDigital={isDigital}>
        {where}
      </WhereText>
    )}
  </PlaceContainer>
)

const PlaceContainer = styled.View({
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
