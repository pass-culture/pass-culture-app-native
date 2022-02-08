import React, { Fragment } from 'react'

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
}: AppButtonInnerProps) {
  return (
    <Fragment>
      {!!LoadingIndicator && isLoading ? (
        <LoadingIndicator {...accessibilityAndTestId(undefined, 'button-isloading-icon')} />
      ) : (
        <Fragment>
          {!!Icon && <Icon {...accessibilityAndTestId(undefined, 'button-icon')} />}
          {!!Title && (
            <Title adjustsFontSizeToFit={adjustsFontSizeToFit} numberOfLines={numberOfLines}>
              {wording}
            </Title>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
