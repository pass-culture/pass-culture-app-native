import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import FilterSwitch from 'ui/components/FilterSwitch'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { ProfileContainer, Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

export function NotificationSettings() {
  const [allowEmails, setAllowEmails] = useState(false)
  const [allowPush, setAllowPush] = useState(false)

  return (
    <React.Fragment>
      <ProfileHeaderWithNavigation title={_(t`Notifications`)} />
      <Spacer.Column numberOfSpaces={6} />
      <ProfileContainer>
        <Typo.Body color={ColorsEnum.BLACK}>
          {_(t`Reste informé des actualités du pass Culture et ne rate aucun de nos bons plans.`)}
        </Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <Separator />
        <Line>
          <SettingExplanation>
            {_(
              t`Je veux recevoir les actualités et les meilleures offres du pass Culture par e\u2011mail.`
            )}
          </SettingExplanation>
          <Spacer.Column numberOfSpaces={4} />
          <SectionRow
            type="clickable"
            title={_(t`Autoriser l’envoi d’e-mails`)}
            cta={
              <FilterSwitch
                active={allowEmails}
                toggle={() => setAllowEmails((prevActive) => !prevActive)}
              />
            }
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Separator />
        <Line>
          <SettingExplanation>
            {_(
              t`Je veux être alerté des actualités et des meilleures offres du pass Culture directement sur mon appareil.`
            )}
          </SettingExplanation>
          <Spacer.Column numberOfSpaces={4} />
          <SectionRow
            type="clickable"
            title={_(t`Autoriser les notifications marketing`)}
            cta={
              <FilterSwitch
                active={allowPush}
                toggle={() => setAllowPush((prevActive) => !prevActive)}
              />
            }
          />
          <Spacer.Column numberOfSpaces={3} />
        </Line>
        <Spacer.Flex flex={1} />
        <ButtonPrimary title={_(t`Enregistrer`)} />
        <Spacer.Column numberOfSpaces={8} />
      </ProfileContainer>
    </React.Fragment>
  )
}

const Line = styled.View({
  paddingVertical: getSpacing(4),
})

const SettingExplanation = styled.Text({
  fontFamily: 'Montserrat-Medium',
  fontSize: 13,
  lineHeight: '16px',
  color: ColorsEnum.GREY_DARK,
})
