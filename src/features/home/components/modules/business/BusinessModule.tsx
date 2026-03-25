import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getBusinessUrl } from 'features/home/components/modules/business/helpers/getBusinessUrl'
import { useShouldDisplayBusinessModule } from 'features/home/components/modules/business/helpers/useShouldDisplayBusinessModule'
import { BusinessModuleProps } from 'features/home/components/modules/business/types'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { EditorialCard } from 'ui/components/EditorialCard'
import { getSpacing } from 'ui/theme'

const FIXED_SIZE = getSpacing(81.75)

const UnmemoizedBusinessModule = (props: BusinessModuleProps) => {
  const focusProps = useHandleFocus()
  const {
    analyticsTitle,
    title,
    date,
    subtitle,
    image: imageURL,
    url,
    homeEntryId,
    index,
    shouldTargetNotConnectedUsers: targetNotConnectedUsersOnly,
    moduleId,
    localizationArea,
    callToAction,
  } = props
  const isDisabled = !url
  const { isLoggedIn, user } = useAuthContext()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const { width } = useWindowDimensions()
  const onPress = useCallback(() => {
    if (!isDisabled) {
      setShouldRedirect(true)
    }
  }, [isDisabled])

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logBusinessBlockClicked({ moduleName: analyticsTitle, moduleId, homeEntryId })
    openUrl(finalUrl)
  }

  useEffect(() => {
    if (!url || !shouldRedirect) return
    const businessUrl = getBusinessUrl(url, user?.email)
    if (businessUrl) logAndOpenUrl(businessUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, user, shouldRedirect])

  const shouldModuleBeDisplayed = useShouldDisplayBusinessModule(
    targetNotConnectedUsersOnly,
    isLoggedIn,
    localizationArea
  )

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.BUSINESS,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  const editorialCardInfo = useMemo(
    () => ({
      imageURL,
      url,
      date,
      title,
      subtitle,
      callToAction,
    }),
    [imageURL, url, date, title, subtitle, callToAction]
  )

  if (!shouldModuleBeDisplayed) return null

  const accessibilityLabel = getComputedAccessibilityLabel(date, title, subtitle, callToAction)

  return (
    <EditorialCard
      height={FIXED_SIZE}
      width={width}
      isFocus={focusProps.isFocus}
      editorialCardInfo={editorialCardInfo}
      accessibilityLabel={accessibilityLabel}
      onFocus={focusProps.onFocus}
      onBlur={focusProps.onBlur}
      onPress={onPress}
    />
  )
}

export const BusinessModule = memo(UnmemoizedBusinessModule)
