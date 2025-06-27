import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AppButtonInnerProps } from 'ui/components/buttons/AppButton/types'
import { getSpacing } from 'ui/theme'

export function AppButtonInner({
  loadingIndicator: LoadingIndicator,
  isLoading,
  icon: Icon,
  iconPosition = 'left',
  title: Title,
  adjustsFontSizeToFit = false,
  numberOfLines = 1,
  wording,
  ellipsizeMode,
}: AppButtonInnerProps) {
  return (
    <Fragment>
      {!!LoadingIndicator && isLoading ? (
        <LoadingIndicator {...accessibilityAndTestId('Chargement en cours')} />
      ) : (
        <Container>
          {iconPosition === 'left' && Icon ? (
            <IconLeftWrapper>
              <Icon testID="button-icon-left" />
            </IconLeftWrapper>
          ) : null}
          {Title ? (
            <Title
              adjustsFontSizeToFit={adjustsFontSizeToFit}
              numberOfLines={numberOfLines}
              ellipsizeMode={ellipsizeMode}>
              {wording}
            </Title>
          ) : null}
          {iconPosition === 'right' && Icon ? (
            <IconRightWrapper>
              <Icon testID="button-icon-right" />
            </IconRightWrapper>
          ) : null}
        </Container>
      )}
    </Fragment>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const IconWrapper = styled.View({ flexShrink: 0, flexDirection: 'row' })

const IconLeftWrapper = styled(IconWrapper)({
  marginRight: getSpacing(2),
})

const IconRightWrapper = styled(IconWrapper)({
  marginLeft: getSpacing(2),
})
