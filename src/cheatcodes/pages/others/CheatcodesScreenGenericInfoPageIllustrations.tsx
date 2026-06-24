import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { CalendarIllustration } from 'ui/svg/icons/CalendarIllustration'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { HappyFaceWithTear } from 'ui/svg/icons/HappyFaceWithTear'
import { Hourglass } from 'ui/svg/icons/Hourglass'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { IdCardInvalid } from 'ui/svg/icons/IdCardInvalid'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Offers } from 'ui/svg/icons/Offers'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { PhonePending } from 'ui/svg/icons/PhonePending'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { SadFace } from 'ui/svg/icons/SadFace'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { LogoDMS } from 'ui/svg/LogoDMS'
import { UserError } from 'ui/svg/UserError'
import { getSpacing, Typo } from 'ui/theme'

type GenericInfoPageIllustrationItem = {
  name: string
  Illustration: FunctionComponent<AccessibleIcon>
  contexts: string[]
}

const LogoDMSIllustration: FunctionComponent<AccessibleIcon> = () => (
  <LogoDMS width={getSpacing(32)} />
)

const genericInfoPageIllustrations: GenericInfoPageIllustrationItem[] = [
  {
    name: 'NoOffer',
    Illustration: NoOffer,
    contexts: ['OfferNotFound', 'VenueNotFound'],
  },
  {
    name: 'NoBookings',
    Illustration: NoBookings,
    contexts: ['BookingNotFound'],
  },
  {
    name: 'HappyFaceWithTear',
    Illustration: HappyFaceWithTear,
    contexts: ['BonificationError', 'IdentityCheckUnavailable'],
  },
  {
    name: 'UserBlocked',
    Illustration: UserBlocked,
    contexts: [
      'GenericSuspendedAccount',
      'AccountSecurity',
      'DeleteProfileEmailHacked',
      'DeleteProfileAccountHacked',
    ],
  },
  {
    name: 'ProfileDeletion',
    Illustration: ProfileDeletion,
    contexts: [
      'SuspendedAccountUponUserRequest',
      'DeactivateProfileSuccess',
      'DeleteProfileConfirmation',
      'DeleteProfileSuccess',
    ],
  },
  {
    name: 'ErrorIllustration',
    Illustration: ErrorIllustration,
    contexts: [
      'QuitSignupModal',
      'QuitIdentityCheckModal',
      'ConfirmDeleteProfile',
      'DeleteProfileAccountNotDeletable',
    ],
  },
  {
    name: 'CalendarIllustration',
    Illustration: CalendarIllustration,
    contexts: ['NotYetUnderageEligibility'],
  },
  {
    name: 'PageNotFound',
    Illustration: PageNotFound,
    contexts: ['PageNotFound'],
  },
  {
    name: 'UserError',
    Illustration: UserError,
    contexts: [
      'SuspensionChoice',
      'MandatoryUpdatePersonalData',
      'SuspendAccountConfirmationWithoutAuthentication',
      'SuspendAccountConfirmation',
      'NotEligibleEduConnect - erreurs utilisateur',
    ],
  },
  {
    name: 'MaintenanceCone',
    Illustration: MaintenanceCone,
    contexts: ['NotEligibleEduConnect - erreur générique'],
  },
  {
    name: 'Hourglass',
    Illustration: Hourglass,
    contexts: ['DisableActivation'],
  },
  {
    name: 'RequestSent',
    Illustration: RequestSent,
    contexts: ['BeneficiaryRequestSent'],
  },
  {
    name: 'SadFace',
    Illustration: SadFace,
    contexts: ['LayoutExpiredLink', 'SetProfileBookingError'],
  },
  {
    name: 'IdCardError',
    Illustration: IdCardError,
    contexts: ['ExpiredOrLostID', 'IdentityCheckPending'],
  },
  {
    name: 'IdCardInvalid',
    Illustration: IdCardInvalid,
    contexts: ['ComeBackLater'],
  },
  {
    name: 'LogoDMS',
    Illustration: LogoDMSIllustration,
    contexts: ['DMSIntroduction'],
  },
  {
    name: 'PhonePending',
    Illustration: PhonePending,
    contexts: ['ValidateEmailChange', 'ConfirmChangeEmail', 'CulturalSurveyIntro'],
  },
  {
    name: 'HappyFace',
    Illustration: HappyFace,
    contexts: ['UpdatePersonalDataConfirmation'],
  },
  {
    name: 'EmailSent',
    Illustration: EmailSent,
    contexts: ['DeleteProfileContactSupport'],
  },
  {
    name: 'TicketBooked',
    Illustration: TicketBooked,
    contexts: ['BookingConfirmation'],
  },
  {
    name: 'Offers',
    Illustration: Offers,
    contexts: ['VerticalPlaylistError'],
  },
]

const genericInfoPageAnimations = [
  'FrenchRepublicAnimation - BonificationGranted, BeneficiaryAccountCreated, FreeBeneficiaryAccountCreated',
  'BirthdayCake - RecreditBirthdayNotification, EighteenBirthday, OnboardingNotEligible',
  'QpiThanks - AccountReactivationSuccess, AccountCreated, CulturalSurveyThanks, OnboardingGeneralPublicWelcome',
  'Geolocation - OnboardingGeolocation',
]

export function CheatcodesScreenGenericInfoPageIllustrations(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesNavigationGenericPages'))

  return (
    <CheatcodesTemplateScreen
      title="Illustrations GenericInfoPage"
      flexDirection="column"
      onGoBack={goBack}>
      <Intro>
        {
          'Galerie compacte des illustrations utilisées dans les GenericInfoPage, avec les écrans concernés.'
        }
      </Intro>

      <CardsContainer>
        {genericInfoPageIllustrations.map(({ name, Illustration, contexts }) => (
          <Card key={name}>
            <IllustrationContainer>
              <Illustration
                accessibilityLabel={`Illustration ${name}`}
                size={getSpacing(32)}
                testID={`genericInfoPageIllustration-${name}`}
              />
            </IllustrationContainer>
            <CardContent>
              <Typo.BodyAccent>{name}</Typo.BodyAccent>
              {contexts.map((context) => (
                <Context key={context}>{`• ${context}`}</Context>
              ))}
            </CardContent>
          </Card>
        ))}
      </CardsContainer>

      <SectionTitle>{'Animations utilisées à la place d’une illustration'}</SectionTitle>
      {genericInfoPageAnimations.map((animation) => (
        <Context key={animation}>{`• ${animation}`}</Context>
      ))}
    </CheatcodesTemplateScreen>
  )
}

const Intro = styled(Typo.Body)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const CardsContainer = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.m,
}))

const Card = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.m,
  padding: theme.designSystem.size.spacing.m,
  borderRadius: theme.designSystem.size.borderRadius.m,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const IllustrationContainer = styled.View(({ theme }) => ({
  width: getSpacing(40),
  minHeight: getSpacing(32),
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: theme.designSystem.color.background.default,
  borderRadius: theme.designSystem.size.borderRadius.m,
}))

const CardContent = styled.View({
  flex: 1,
})

const Context = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const SectionTitle = styled(Typo.BodyAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.s,
}))
