import React, { ReactElement } from 'react'

import { PublicServiceBanner } from 'features/profile/components/PublicDisabilityServices/PublicServiceBanner'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { LogoAccesLibre } from 'ui/svg/LogoAccesLibre'
import { LogoAidantConnect } from 'ui/svg/LogoAidantConnect'
import { LogoAudioDescription } from 'ui/svg/LogoAudioDescription'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { LogoMonParcoursHandicap } from 'ui/svg/LogoMonParcoursHandicap'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export type PublicService = {
  name: string
  url: string
  description: string
  illustration?: ReactElement
}

const PUBLIC_SERVICES: PublicService[] = [
  {
    name: 'AccesLibre',
    url: 'https://accessibilite.numerique.gouv.fr/',
    description: 'L’accessibilité des lieux publics, selon votre handicap, à portée de clic.',
    illustration: <LogoAccesLibre />,
  },
  {
    name: 'Aidant connect',
    url: 'https://aidantsconnect.beta.gouv.fr/',
    description: 'Accompagnez vos usagers en toute sécurité',
    illustration: <LogoAidantConnect />,
  },
  {
    name: 'Aides simplifiées',
    url: 'https://aides.beta.numerique.gouv.fr/',
    description:
      'Trouvez les aides adaptées à votre situation OU La bonne aide, au bon moment, au bon endroit.',
    illustration: <LogoFrenchRepublic />,
  },
  {
    name: 'Mon parcours handicap',
    url: 'https://www.monparcourshandicap.gouv.fr/',
    description:
      'Le site d’information officiel pour les personnes en situation de handicap et leurs aidants.',
    illustration: <LogoMonParcoursHandicap />,
  },
  {
    name: 'Portail de l’audiodescription',
    url: 'https://audiodescription.culture.gouv.fr/',
    description: 'Catalogue de films disponibles en version audiodécrite.',
    illustration: <LogoAudioDescription />,
  },
]

export const PublicDisabilityServices = () => {
  const sortedServices = [...PUBLIC_SERVICES].sort((a, b) => a.name.localeCompare(b.name, 'fr'))

  return (
    <PageWithHeader
      title="Outils et services publics"
      scrollChildren={
        <ViewGap gap={5}>
          <Typo.Title3 {...setTextSemantic('h2')}>Des services pensés pour toi</Typo.Title3>
          <Typo.Body>
            Retrouve ici les outils et services publics pensés pour t’accompagner et rendre la
            société plus accessible à tous.
          </Typo.Body>
          <VerticalUl gap={4}>
            {sortedServices.map((service) => (
              <Li key={service.name}>
                <PublicServiceBanner key={service.url} {...service} />
              </Li>
            ))}
          </VerticalUl>
        </ViewGap>
      }
    />
  )
}
