import { NonEligible } from 'features/onboarding/types'

export const getModalInfoForNonEligible = (modalType: NonEligible) => {
  if (modalType === NonEligible.UNDER_15) {
    return {
      title: 'Encore un peu de patience\u00a0!',
      firstParagraph: `Tu peux bénéficier de ton crédit sur l’application à partir de tes 15 ans.`,
      secondParagraph: `En attendant, tu peux explorer le catalogue des offres et découvrir des lieux culturels autour de toi.`,
      withFAQLink: true,
    }
  }
  return {
    title: 'Tu arrives un peu trop tard',
    firstParagraph: `Après 18 ans, tu n’es malheureusement plus éligible au pass Culture.`,
    secondParagraph: `Tu peux toujours explorer le catalogue des offres et découvrir des lieux culturels autour de toi sur l’application.`,
    withFAQLink: false,
  }
}
