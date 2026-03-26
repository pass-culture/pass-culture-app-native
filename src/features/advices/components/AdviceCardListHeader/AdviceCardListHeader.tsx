import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'

type Props = {
  title: string
  buttonWording: string
  onPressMoreInfo: VoidFunction
}

export const AdviceCardListHeader: FunctionComponent<Props> = ({
  title,
  buttonWording,
  onPressMoreInfo,
}) => {
  return (
    <ViewGap gap={2}>
      <Typo.Title2>{title}</Typo.Title2>
      <ButtonContainer>
        <Button
          wording={buttonWording}
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
