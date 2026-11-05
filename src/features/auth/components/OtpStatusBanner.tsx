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
  label: string
  type?: BannerType
  icon?: FunctionComponent<AccessibleIcon>
  description?: string
  complementaryText?: string
  countdownText?: string
}

type OtpLastAttemptProps = { isLastAttempt?: boolean }
type OtpCodeExpiredProps = { isCodeExpired?: boolean }
type OtpNewCodeSentProps = { isNewCodeSent?: boolean; resendCountdown?: number }
type OtpAccountLockedProps = {
  isAccountLocked: boolean
  remainingSeconds: number
  email?: string | null
}

type OtpStatusBannerProps = OtpLastAttemptProps &
  OtpAccountLockedProps &
  OtpNewCodeSentProps &
  OtpCodeExpiredProps

export const OtpStatusBanner = ({
  isAccountLocked,
  remainingSeconds,
  email,
  isCodeExpired = false,
  isNewCodeSent = false,
  isLastAttempt = false,
  resendCountdown = 0,
}: OtpStatusBannerProps) => {
  let bannerConfig: OtpBannerConfig | null = null

  if (isAccountLocked) {
    bannerConfig = {
      type: BannerType.ERROR,
      label: email
        ? `Le compte ${email} est temporairement inaccessible.`
        : 'Ce compte est temporairement inaccessible.',
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
  } else if (isNewCodeSent) {
    bannerConfig = {
      type: BannerType.DEFAULT,
      label: 'Un nouveau code t’a été envoyé.',
      complementaryText: 'Tu pourras demander un nouveau code dans ',
      countdownText: formatRemainingTime(resendCountdown),
    }
  }

  const shouldDisplayCooldownBanner =
    isLastAttempt && isNewCodeSent && !isAccountLocked && !isCodeExpired

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
  marginVertical: theme.designSystem.size.spacing.l,
}))
