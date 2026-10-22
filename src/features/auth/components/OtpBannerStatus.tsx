import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { formatRemainingTime } from 'shared/times/formatRemainingTime'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type OtpBannerConfig = {
  type?: BannerType
  icon?: FunctionComponent<AccessibleIcon>
  label: string
  description?: string
  complementaryText?: string
  countdownText?: string
}

type OtpStatusBannerProps = {
  isAccountLocked: boolean
  isCodeExpired: boolean
  isCooldownActive: boolean
  isLastAttempt: boolean
  email?: string
  remainingSeconds: number
  resendCountdown?: number
}

export const OtpStatusBanner = ({
  isAccountLocked,
  isCodeExpired,
  isCooldownActive,
  isLastAttempt,
  email,
  remainingSeconds,
  resendCountdown = 0,
}: OtpStatusBannerProps) => {
  let bannerConfig: OtpBannerConfig | null = null

  if (isAccountLocked) {
    bannerConfig = {
      type: BannerType.ERROR,
      label: `Le compte ${email ?? ''} est temporairement inaccessible.`,
      description: `Un peu de patience, tu pourras te reconnecter dans ${formatRemainingTime(remainingSeconds)}.`,
    }
  } else if (isCodeExpired) {
    bannerConfig = {
      icon: WarningFilled,
      type: BannerType.ALERT,
      label: 'Ce code a expiré, demandes-en un nouveau pour continuer.',
    }
  } else if (isLastAttempt) {
    bannerConfig = {
      icon: WarningFilled,
      type: BannerType.ALERT,
      label: 'Attention, il ne te reste qu’un essai.',
      description:
        'Si tu saisis un nouveau code incorrect, ton compte sera temporairement suspendu pendant 1 heure.',
    }
  } else if (isCooldownActive) {
    bannerConfig = {
      type: BannerType.DEFAULT,
      label: 'Un nouveau code t’a été envoyé.',
      complementaryText: 'Tu pourras demander un nouveau code dans ',
      countdownText: formatRemainingTime(resendCountdown),
    }
  }

  const shouldDisplayCooldownBanner =
    isLastAttempt && isCooldownActive && !isAccountLocked && !isCodeExpired

  if (!bannerConfig) return null

  return (
    <BannerContainer gap={4}>
      <Banner
        Icon={bannerConfig.icon}
        type={bannerConfig.type}
        label={bannerConfig.label}
        description={bannerConfig.description}
      />

      {bannerConfig.complementaryText ? (
        <Typo.BodyXs>
          {bannerConfig.complementaryText}
          <Typo.BodyAccentXs>{bannerConfig.countdownText}</Typo.BodyAccentXs>
        </Typo.BodyXs>
      ) : null}

      {shouldDisplayCooldownBanner ? (
        <React.Fragment>
          <Banner type={BannerType.DEFAULT} label="Un nouveau code t’a été envoyé." />
          <Typo.BodyXs>
            Tu pourras demander un nouveau code dans{SPACE}
            <Typo.BodyAccentXs>{formatRemainingTime(resendCountdown)}</Typo.BodyAccentXs>
          </Typo.BodyXs>
        </React.Fragment>
      ) : null}
    </BannerContainer>
  )
}

const BannerContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
