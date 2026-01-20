import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { analytics } from 'libs/analytics/provider'
import { Accordion } from 'ui/components/Accordion'
import FilterSwitch from 'ui/components/FilterSwitch'
import { Separator } from 'ui/components/Separator'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CookiesAccordion = ({
  cookie,
  settingsCookiesChoice,
  setSettingsCookiesChoice,
  offerId,
}: { cookie: CookieCategoriesEnum } & CookiesChoiceSettings) => {
  const info = cookiesInfo[cookie]
  const isEssential = cookie === CookieCategoriesEnum.essential
  const accordionLabelId = uuidv4()

  const toggleSwitch = () =>
    isEssential
      ? null
      : setSettingsCookiesChoice((prev) => ({
          ...prev,
          [cookie]: !settingsCookiesChoice[cookie],
        }))

  const defaultOpen = cookie === CookieCategoriesEnum.video && !!offerId

  return (
    <React.Fragment>
      <StyledAccordionItem
        title={<Typo.Body>{info.title}</Typo.Body>}
        onOpenOnce={() => analytics.logHasOpenedCookiesAccordion(cookie)}
        labelId={accordionLabelId}
        leftComponent={
          <FilterSwitch
            testID={info.title}
            active={isEssential ? true : settingsCookiesChoice[cookie]}
            disabled={isEssential}
            accessibilityLabelledBy={accordionLabelId}
            toggle={toggleSwitch}
            accessibilityLabel={info.title}
          />
        }
        defaultOpen={defaultOpen}>
        <React.Fragment>
          <Typo.Body>{info.description}</Typo.Body>
          {info.caption ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <InfoCaption>{info.caption}</InfoCaption>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      </StyledAccordionItem>
      {info.permanentCaption ? (
        <React.Fragment>
          <InfoCaption>{info.permanentCaption}</InfoCaption>
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}
      <Separator.Horizontal />
    </React.Fragment>
  )
}

const InfoCaption: React.FC<PropsWithChildren> = ({ children }) => (
  <View>
    <IconContainer>
      <StyledInfo />
    </IconContainer>
    <CaptionNeutralInfo>
      <IconSpacer />
      {children}
    </CaptionNeutralInfo>
  </View>
)

const SPACER_BETWEEN_ICON_AND_TEXT = getSpacing(1)
const IconSpacer = styled.View(({ theme }) => ({
  width: theme.icons.sizes.extraSmall + SPACER_BETWEEN_ICON_AND_TEXT,
}))

const IconContainer = styled.View({
  position: 'absolute',
})

const StyledInfo = styled(InfoPlain).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledAccordionItem = styled(Accordion).attrs(({ theme }) => ({
  titleStyle: {
    paddingVertical: theme.designSystem.size.spacing.l,
    paddingHorizontal: 0,
  },
  bodyStyle: {
    paddingBottom: theme.designSystem.size.spacing.l,
    paddingHorizontal: 0,
  },
}))``

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
