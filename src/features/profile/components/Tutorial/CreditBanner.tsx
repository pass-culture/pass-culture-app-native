import React from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { Banner } from 'ui/designSystem/Banner/Banner'

type Props = { enableBonification: boolean }

const FAQ_LINK_PASS_CULTURE = {
  wording: 'Plus d’infos sur ton crédit',
  externalNav: { url: env.FAQ_LINK_PASS_CULTURE },
  onBeforeNavigate: () => analytics.logHasClickedTutorialFAQ({ type: 'FAQ_LINK_PASS_CULTURE' }),
}

const FAQ_BONIFICATION_GENERIC = {
  wording: 'Plus d’infos sur les bonus sous conditions',
  externalNav: { url: env.FAQ_BONIFICATION_GENERIC },
  onBeforeNavigate: () => analytics.logHasClickedTutorialFAQ({ type: 'FAQ_BONIFICATION_GENERIC' }),
}

export const CreditBanner = ({ enableBonification }: Props) => (
  <BannerContainer>
    <Banner
      label="Des questions sur ton crédit&nbsp;?"
      description="N’hésite pas à consulter nos pages d’aide pour trouver les réponses à tes questions."
      links={[FAQ_LINK_PASS_CULTURE, ...(enableBonification ? [FAQ_BONIFICATION_GENERIC] : [])]}
    />
  </BannerContainer>
)

const BannerContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
