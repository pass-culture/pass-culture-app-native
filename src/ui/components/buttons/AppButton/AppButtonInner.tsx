import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AppButtonInnerProps } from 'ui/components/buttons/AppButton/types'

export function AppButtonInner({
  loadingIndicator: LoadingIndicator,
  isLoading,
  icon: Icon,
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
        <Fragment>
          {!!Icon && (
            <IconWrapper>
              <Icon testID="button-icon" />
            </IconWrapper>
          )}
          {!!Title && (
            <Title
              adjustsFontSizeToFit={adjustsFontSizeToFit}
              numberOfLines={numberOfLines}
              ellipsizeMode={ellipsizeMode}>
              {wording}
            </Title>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

const IconWrapper = styled.View({ flexShrink: 0 })
