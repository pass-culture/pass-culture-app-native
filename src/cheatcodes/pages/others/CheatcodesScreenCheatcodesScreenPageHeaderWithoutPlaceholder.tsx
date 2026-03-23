import React from 'react'
import styled from 'styled-components/native'

import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { Typo } from 'ui/theme'

export const CheatcodesScreenPageHeaderWithoutPlaceholder = () => {
  const headerHeight = useGetHeaderHeight()
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder
        title="Title"
        RightButton={<RightButtonText wording="Quitter" onClose={goBack} />}
      />
      <Placeholder height={headerHeight} />
      <Typo.Body>Children...</Typo.Body>
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
