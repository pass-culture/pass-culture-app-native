import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { MapPin } from 'ui/svg/icons/MapPin'
import { getShadow, getSpacing, Typo } from 'ui/theme'

type Props = {
  count?: number
}

const NUMBER_LEFT_POSITION = '15px'
const NUMBER_TOP_POSITION = '-10px'

export const VenueMapPin: FunctionComponent<Props> = ({ count }) => {
  return (
    <React.Fragment>
      <MapPin />

      {count ? (
        <NumberContainer testID="numberContainer">
          <Typo.Caption>{count < 100 ? String(count) : '99+'}</Typo.Caption>
        </NumberContainer>
      ) : null}
    </React.Fragment>
  )
}

const NumberContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  paddingVertical: getSpacing(0.5),
  paddingHorizontal: getSpacing(1),
  borderRadius: getSpacing(8),
  backgroundColor: theme.colors.white,
  left: NUMBER_LEFT_POSITION,
  top: NUMBER_TOP_POSITION,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(0.25) },
    shadowRadius: getSpacing(1.5),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))
