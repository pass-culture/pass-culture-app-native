import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { AdviceVariantInfo } from 'features/advices/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'

type Props = {
  variantInfo: AdviceVariantInfo
  onPressMoreInfo: VoidFunction
}

export const AdviceCardListHeader: FunctionComponent<Props> = ({
  variantInfo,
  onPressMoreInfo,
}) => {
  return (
    <ViewGap gap={2}>
      <Typo.Title2>Tous les avis du {variantInfo.labelReaction}</Typo.Title2>
      <ButtonContainer>
        <Button
          wording={variantInfo.modalTitle}
          icon={InfoPlain}
          onPress={onPressMoreInfo}
          variant="tertiary"
          color="neutral"
          size="small"
        />
      </ButtonContainer>
    </ViewGap>
  )
}

const ButtonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))
