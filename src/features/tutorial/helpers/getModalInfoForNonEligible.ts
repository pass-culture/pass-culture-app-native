import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { BicolorBirthdayCake } from 'ui/svg/icons/BicolorBirthdayCake'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'

export const getModalInfoForNonEligible = (modalType: NonEligible, type: TutorialTypes) => {
  if (modalType === NonEligible.UNDER_15) {
    return {
      title: 'Encore un peu de patience\u00a0!',
      firstParagraph: `Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.`,
      secondParagraph: `En attendant, tu peux explorer le catalogue des offres et découvrir des lieux culturels autour de toi.`,
      withFAQLink: type === TutorialTypes.ONBOARDING,
      Illustration: BicolorBirthdayCake,
    }
  }
  return {
    title: 'Tu arrives un peu trop tard',
    firstParagraph: `Après 18 ans, tu n’es malheureusement plus éligible au pass Culture.`,
    secondParagraph: `Tu peux toujours explorer le catalogue des offres et découvrir des lieux culturels autour de toi sur l’application.`,
    withFAQLink: false,
    Illustration: BicolorCircledClock,
  }
}
