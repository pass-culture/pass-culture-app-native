import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

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
      {...setTextSemantic('h1')}>
      {offerName}
    </TitleComponent>
  )
}
