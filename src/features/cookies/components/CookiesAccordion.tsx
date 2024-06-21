import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { cookiesInfo } from 'features/cookies/components/cookiesInfo'
import { CookieCategoriesEnum } from 'features/cookies/enums'
import { CookiesChoiceSettings } from 'features/cookies/types'
import { analytics } from 'libs/analytics'
import { Accordion } from 'ui/components/Accordion'
import FilterSwitch from 'ui/components/FilterSwitch'
import { Separator } from 'ui/components/Separator'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CookiesAccordion = ({
  cookie,
  settingsCookiesChoice,
  setSettingsCookiesChoice,
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
          />
        }>
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
    <Typo.CaptionNeutralInfo>
      <IconSpacer />
      {children}
    </Typo.CaptionNeutralInfo>
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
  color: theme.colors.primary,
}))``

const StyledAccordionItem = styled(Accordion).attrs({
  titleStyle: {
    paddingVertical: getSpacing(4),
    paddingHorizontal: 0,
  },
  bodyStyle: {
    paddingBottom: getSpacing(4),
    paddingHorizontal: 0,
  },
})``
