import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { STORE_LINK, TITLE, BUTTON_TEXT, DESCRIPTION } from 'features/forceUpdate/constants'
import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { openUrl } from 'features/navigation/helpers'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Star } from 'ui/svg/icons/Star'
import { Typo } from 'ui/theme'

import { build } from '../../../../package.json'

type ForceUpdateProps = {
  resetErrorBoundary: () => void
}

const onPressStoreLink = Platform.select({
  default: () => openUrl(STORE_LINK),
  web: () => globalThis?.window?.location?.reload(),
})

export const ForceUpdate = ({ resetErrorBoundary }: ForceUpdateProps) => {
  const minimalBuildNumber = useMinimalBuildNumber()

  // This first hook will be like a componentWillUnmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetErrorBoundary, [])

  // This one is for when minimalBuildNumber gets back to an older value
  useEffect(() => {
    // it must be false and not null (which means not fetched)
    if (!!minimalBuildNumber && build >= minimalBuildNumber) {
      resetErrorBoundary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimalBuildNumber])

  return (
    <React.Fragment>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GenericInfoPage
        title={TITLE}
        icon={Star}
        buttons={[
          <ButtonPrimaryWhite key={BUTTON_TEXT} wording={BUTTON_TEXT} onPress={onPressStoreLink} />,
        ]}>
        <StyledBody>{DESCRIPTION}</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
