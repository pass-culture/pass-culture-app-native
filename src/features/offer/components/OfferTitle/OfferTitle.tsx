import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerName: string
}

export const OfferTitle: FunctionComponent<Props> = ({ offerName }) => {
  const { isDesktopViewport } = useTheme()
  const TitleComponent = isDesktopViewport ? Typo.Title1 : Typo.Title3

  return (
    <TitleComponent
      adjustsFontSizeToFit
      allowFontScaling={false}
      {...accessibilityAndTestId(`Nom de l’offre\u00a0: ${offerName}`)}
      {...getHeadingAttrs(1)}>
      {offerName}
    </TitleComponent>
  )
}
