import React from 'react'
import styled from 'styled-components/native'

import { ContactSupportButton } from 'features/profile/components/Buttons/ContactSupportButton/ContactSupportButton'
import { PageProfileSection } from 'features/profile/components/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function AccessibilityEngagement() {
  return (
    <PageProfileSection title="Les engagements du pass Culture" scrollable>
      <StyledBody>Date de publication&nbsp;: 19 mai 2022</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Au pass Culture, notre mission est de renforcer et de diversifier les pratiques culturelles
        de tous les jeunes de 15 à 25 ans. En d’autres termes, le pass Culture a pour vocation de
        rendre accessible la culture à une population qui est souvent empêchée par de multiples
        freins. Le pass Culture s’appuie sur la longue histoire des politiques françaises de
        démocratisation de la culture pour rapprocher tous les usagers des acteurs culturels, quelle
        que soit leur situation.
        {LINE_BREAK}
        Le choix d’une politique publique matérialisée par un produit numérique nous oblige à
        envisager cette question également sous le prisme de l’accessibilité numérique.
        {LINE_BREAK}
        Le pass Culture s’inscrit ainsi dans la continuité des politiques publiques d’inclusion
        numérique. Tout d’abord en s’appuyant sur les initiatives existantes tournées vers
        l’illettrisme numérique, vers l’engagement du “non-public”, la mise à disposition
        d’équipements numériques et plus globalement la médiation numérique. Nous travaillons
        également à l’adaptation de son service aux personnes en situation de handicap.
        {LINE_BREAK}À cet égard et afin de pérenniser la démarche, un groupe de travail transversal
        a été créé en interne. Il est composé d’une personne en lien avec les publics, d’ingénieurs
        en informatique, d’une designeuse, et d’une personne dédiée à la conception du produit.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <TitleText>L’inclusion au coeur de la stratégie technique</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Deux audits évaluant l’accessibilité de la version web du pass Culture ont déjà été conduits
        en 2020 et 2022 pour permettre de rendre compte et d’évaluer le travail effectué. Le dernier
        sera disponible dans les prochaines semaines.
        {LINE_BREAK}
        Nous prenons en compte dans nos développements la compatibilité avec un maximum de versions
        de système d’exploitation ou de modèles de téléphone. Cependant, nous recommandons aux
        utilisateurs en situation de handicap d’utiliser les dernières versions de notre
        application, de leur navigateur, de leur système d’exploitation et des logiciels
        d’assistance.
        {LINE_BREAK}
        Ce travail pour rendre et maintenir accessibles les parcours clé de l’application web est le
        socle pour construire un environnement numérique inclusif et ainsi initier des échanges
        dédiés avec les acteurs du monde de l’accessibilité et utilisateurs en situation de
        handicap.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <TitleText>Collaboration et sensibilisation</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Au-delà de la technologie utilisée, les acteurs culturels avec lesquels nous travaillons
        sont sensibilisés à la question de l’accessibilité. Ils ont l’obligation d’indiquer si leur
        lieu et leurs offres sont accessibles selon une nomenclature faisant référence aux
        différentes catégories de handicap. L’implication des acteurs culturels dans notre démarche
        d’accessibilité est évidemment essentielle à la dimension inclusive de l’ensemble du
        dispositif pass Culture et, in fine, à l’accès de tous les jeunes à la culture.
        {LINE_BREAK}
        De la même manière, le rôle des aidants et des structures d’accompagnement est primordial
        pour garantir une bonne information auprès des publics en situation de handicap et
        éventuellement fournir un appui nécessaire aux moins autonomes. Ainsi, nous sommes en
        contact avec certains grands réseaux nationaux à travers lesquels nous diffusons de
        l’information sur le pass Culture. Notre volonté est d’être le plus possible au contact des
        structures et des professionnels pour leur donner les moyens d’accompagner leurs publics
        mais également pour être à l’écoute des retours des utilisateurs.
        {LINE_BREAK}
        Ces retours utilisateurs nourrirons alors le travail de nos équipes pour continuer à adapter
        le pass Culture aux usages de l’ensemble de nos utilisateurs. L’accessibilité est toujours
        une histoire en mouvement. Vous trouverez d’ailleurs dans le schéma pluriannuel les
        chantiers sur lesquels nous travaillons à ce niveau.
        {DOUBLE_LINE_BREAK}
        Si vous avez des retours au sujet de notre traitement, n’hésitez pas à écrire à
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ContactSupportButton />
      <Spacer.Column numberOfSpaces={6} />
      <Typo.CaptionNeutralInfo>
        Vous pouvez retrouver également toutes nos fiches d’aide pour vous inscrire sur le pass
        Culture directement dans{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          wording="notre centre d’aide"
          typography="Caption"
          icon={ExternalSiteFilled}
          externalNav={{ url: env.FAQ_LINK }}
        />
      </Typo.CaptionNeutralInfo>
      <Spacer.BottomScreen />
    </PageProfileSection>
  )
}

const TitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.italic,
}))
