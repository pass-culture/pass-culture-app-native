import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, getSpacing } from 'ui/theme'

export const PageHeader = ({ title }: { title: string }) => {
  const { goBack } = useGoBack(...homeNavConfig)

  return (
    <HeaderContainer>
      <ModalHeader
        title={title}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
        customStyles={customStyles}
      />
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  padding: getSpacing(4),
})

const customStyles = {
  leftIcon: { color: ColorsEnum.WHITE },
  title: { color: ColorsEnum.WHITE },
}
