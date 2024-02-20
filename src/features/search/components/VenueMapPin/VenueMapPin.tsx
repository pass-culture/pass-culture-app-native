import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { MapPin } from 'ui/svg/icons/MapPin'
import { getShadow, getSpacing, Typo } from 'ui/theme'

type Props = {
  count?: number
}

const NUMBER_LEFT_POSITION = 15
const NUMBER_TOP_POSITION = -10

export const VenueMapPin: FunctionComponent<Props> = ({ count }) => {
  const shouldDisplayCounter = count && count > 1

  return (
    <React.Fragment>
      <MapPin />

      {shouldDisplayCounter ? (
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
  borderRadius: theme.borderRadius.button,
  backgroundColor: theme.colors.white,
  left: NUMBER_LEFT_POSITION,
  top: NUMBER_TOP_POSITION,
  ...getShadow({
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: getSpacing(1.5),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))
