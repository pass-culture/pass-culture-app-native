import React, { FunctionComponent } from 'react'

import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  onPressMoreInfo: VoidFunction
}

export const ChronicleCardListHeader: FunctionComponent<Props> = ({ onPressMoreInfo }) => {
  return (
    <ViewGap gap={2}>
      <Typo.Title2>Tous les avis</Typo.Title2>
      <StyledButtonQuaternaryBlack
        wording="Qui écrit les avis&nbsp;?"
        icon={InfoPlain}
        onPress={onPressMoreInfo}
      />
    </ViewGap>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)(({ theme }) => ({
  width: getSpacing(34),
  marginBottom: theme.designSystem.size.spacing.xl,
}))
