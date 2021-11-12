import { t } from '@lingui/macro'
import { Spacer } from '@pass-culture/id-check'
import React, { PropsWithChildren } from 'react'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

type Props = PropsWithChildren<{ title: string }>

export const PageWithHeader = (props: Props) => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <BottomContentPage>
      <ModalHeader
        title={props.title}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <Spacer.Column numberOfSpaces={4} />
      {props.children}
    </BottomContentPage>
  )
}
