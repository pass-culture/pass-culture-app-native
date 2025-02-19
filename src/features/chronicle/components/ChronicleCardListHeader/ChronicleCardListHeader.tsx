import React, { FunctionComponent } from 'react'

import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  onPressMoreInfo: VoidFunction
}

export const ChronicleCardListHeader: FunctionComponent<Props> = ({ onPressMoreInfo }) => {
  return (
    <ViewGap gap={2}>
      <TypoDS.Title2>Tous les avis</TypoDS.Title2>
      <StyledButtonQuaternaryBlack
        wording="Qui écrit les avis&nbsp;?"
        icon={InfoPlain}
        onPress={onPressMoreInfo}
      />
    </ViewGap>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)({
  width: getSpacing(34),
  marginBottom: getSpacing(6),
})
