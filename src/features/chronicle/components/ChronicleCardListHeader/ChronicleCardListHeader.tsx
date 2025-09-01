import React, { FunctionComponent } from 'react'

import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  variantInfo: ChronicleVariantInfo
  onPressMoreInfo: VoidFunction
}

export const ChronicleCardListHeader: FunctionComponent<Props> = ({
  variantInfo,
  onPressMoreInfo,
}) => {
  return (
    <ViewGap gap={2}>
      <Typo.Title2>Tous les avis du {variantInfo.labelReaction}</Typo.Title2>
      <StyledButtonQuaternaryBlack
        wording={variantInfo.modalTitle}
        icon={InfoPlain}
        onPress={onPressMoreInfo}
      />
    </ViewGap>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack)(({ theme }) => ({
  width: getSpacing(44),
  marginBottom: theme.designSystem.size.spacing.xl,
}))
