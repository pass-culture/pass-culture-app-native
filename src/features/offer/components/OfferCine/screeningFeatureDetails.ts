import { CinemaScreeningAccessibilityCategory } from 'features/bookings/components/CinemaScreeningDetailsModal/types'

export type ScreeningDetailContent = {
  name: string
  description: string
}

export type AccessibilityDetailContent = ScreeningDetailContent & {
  category: CinemaScreeningAccessibilityCategory
}

export const VIDEO: Record<string, ScreeningDetailContent> = {
  '4DX': {
    name: '4DX',
    description:
      'Les sièges bougent au rythme du film et des effets s’ajoutent\u00a0: vent, eau, odeurs, lumière… Accès limité selon l’âge ou la taille.',
  },
  '4DX_3D': {
    name: '4DX 3D',
    description:
      'Film en relief en salle 4DX\u00a0: sièges qui bougent, effets (vent, eau, odeurs…). Lunettes 3D nécessaires. Accès limité selon l’âge ou la taille.',
  },
  IMAX: {
    name: 'IMAX',
    description:
      'Le film est projeté sur un très grand écran, avec un son puissant. Certains films y ont une image plus haute qu’ailleurs.',
  },
  IMAX_3D: {
    name: 'IMAX3D',
    description:
      'Le film est projeté en relief sur un très grand écran IMAX. Il faut des lunettes 3D, fournies ou vendues par le cinéma.',
  },
  SCREEN_X: {
    name: 'ScreenX',
    description:
      'Le film est projeté sur l’écran et sur les murs de gauche et de droite. Seules certaines scènes s’étendent sur les murs.',
  },
  DOLBY_VISION: {
    name: 'DolbyVision',
    description:
      'Le film est projeté avec la technologie Dolby Vision\u00a0: image très contrastée, noirs profonds et couleurs vives.',
  },
  DOLBY_VISION_3D: {
    name: 'DolbyVision 3D',
    description:
      'Le film est projeté en relief avec Dolby Vision\u00a0: image très contrastée et couleurs vives. Il faut des lunettes 3D.',
  },
  '2D': {
    name: '2D',
    description: 'Le film est projeté de façon classique, sans relief. Pas besoin de lunettes.',
  },
  '3D': {
    name: '3D',
    description:
      'Le film est projeté en relief. Il faut des lunettes 3D, fournies ou vendues par le cinéma.',
  },
  '4K': {
    name: '4K',
    description:
      'Le film est projeté en très haute définition\u00a0: l’image est plus nette et plus détaillée qu’en projection classique.',
  },
  ODYSEE: {
    name: 'Odyssée',
    description:
      'Le film est projeté dans une salle premium avec des fauteuils qui s’inclinent entièrement à commande électrique',
  },
  SPHERA: {
    name: 'Sphera',
    description:
      'Le film est projeté sur un écran géant qui couvre tout le mur, d’un côté à l’autre de la salle, avec des basses renforcées.',
  },
  HFR: {
    name: 'HFR',
    description:
      'Le film est projeté avec plus d’images par seconde (48 ou plus, contre 24 d’habitude)\u00a0: les mouvements sont plus fluides.',
  },
  ONYX: {
    name: 'Onyx',
    description:
      'Le film est diffusé sur un écran LED Samsung Onyx, sans projecteur\u00a0: l’image est très lumineuse, avec des noirs profonds.',
  },
  '70MM': {
    name: '70mm',
    description:
      'Le film est projeté sur pellicule grand format (70 mm) et non en numérique\u00a0: l’image est très détaillée.',
  },
  OMNIMAX: {
    name: 'Omnimax',
    description:
      'Le film est projeté sur un écran en forme de dôme, qui s’étend au-dessus et autour du public.',
  },
  LASER: {
    name: 'Laser',
    description:
      'Le film est projeté avec un projecteur laser\u00a0: l’image est plus lumineuse et plus contrastée qu’avec un projecteur classique.',
  },
  MX_4D: {
    name: 'MX4D',
    description:
      'Les sièges bougent au rythme du film et des effets s’ajoutent\u00a0: vent, eau, odeurs…',
  },
  MX_4D_3D: {
    name: 'MX4D 3D',
    description:
      'Film en relief en salle MX4D\u00a0: sièges qui bougent, effets (vent, eau, odeurs…). Lunettes 3D nécessaires.',
  },
}

const dolbyAtmos: ScreeningDetailContent = {
  name: 'Dolby Atmos',
  description: 'Le son vient de tous les côtés de la salle, y compris du plafond.',
}

export const AUDIO: Record<string, ScreeningDetailContent> = {
  ATMOS: dolbyAtmos,
  DOLBY_ATMOS: dolbyAtmos,
  SON_IMMERSIF: {
    name: 'Son Immersif',
    description: 'Le son vient de tous les côtés de la salle, y compris du dessus.',
  },
  AURO_3D: {
    name: 'Auro-3D',
    description:
      'Le son vient de tous les côtés et du dessus, grâce à des enceintes placées en hauteur.',
  },
  DSTX: {
    name: 'DTS:X',
    description:
      'Le son vient de tous les côtés de la salle, y compris du dessus. Technologie DTS:X.',
  },
  MONO: {
    name: 'Mono',
    description: 'Le son sort d’une seule voie, sans effet d’espace.',
  },
  DOLBY_31: {
    name: 'Dolby 3.1',
    description:
      'Le son est réparti sur trois enceintes derrière l’écran (gauche, centre, droite) et un caisson de basses.',
  },
  DOLBY_51: {
    name: 'Dolby 5.1',
    description:
      'Le son est réparti sur 5 voies (devant et sur les côtés) et un caisson de basses.',
  },
  DOLBY_71: {
    name: 'Dolby 7.1',
    description: 'Le son est réparti sur 7 voies (devant, côtés, arrière) et un caisson de basses.',
  },
}

const avantPremiere: ScreeningDetailContent = {
  name: 'Avant-première',
  description: 'Le film est projeté avant sa sortie officielle en salles.',
}

export const EVENT: Record<string, ScreeningDetailContent> = {
  PLEIN_AIR: {
    name: 'Plein air',
    description:
      'Le film est projeté en extérieur. Mieux vaut prévoir une tenue adaptée à la météo.',
  },
  DRIVE_IN: {
    name: 'Drive-in',
    description:
      'Le film est projeté en extérieur et se regarde depuis sa voiture. Le son passe souvent par l’autoradio.',
  },
  CINE_CONCERT: {
    name: 'Ciné-concert',
    description:
      'Des musiciennes et musiciens jouent la musique du film en direct, pendant la projection.',
  },
  AVANT_PREMIERE: avantPremiere,
  PREVIEW_SCREENING: avantPremiere,
  AVANT_PREMIERE_EQUIPE: {
    name: 'Avant-première équipe',
    description:
      'Le film est projeté avant sa sortie, en présence de membres de l’équipe du film (réalisation, interprètes…).',
  },
  CINE_DEBAT: {
    name: 'Ciné-débat',
    description:
      'La projection est suivie d’un débat avec le public, souvent animé par une personne invitée.',
  },
  DERNIERE_DIFFUSION: {
    name: 'Dernière projection',
    description: 'C’est la dernière séance de ce film prévue dans ce cinéma.',
  },
  SEANCE_UNIQUE: {
    name: 'Séance unique',
    description: 'Le film n’est projeté qu’une seule fois dans ce cinéma.',
  },
  PREMIERE_DIFFUSION: {
    name: 'Première projection',
    description:
      'C’est la première séance de ce film dans ce cinéma, souvent le jour de sa sortie.',
  },
  RENCONTRE: {
    name: 'Rencontre',
    description:
      'La projection est accompagnée d’une rencontre avec une personne invitée\u00a0: membre de l’équipe du film, spécialiste du sujet…',
  },
  REPLAY: {
    name: 'Rediffusion',
    description:
      'Un événement déjà enregistré (opéra, concert, spectacle…) est diffusé sur l’écran du cinéma. Ce n’est pas du direct.',
  },
  LIVE: {
    name: 'En Direct',
    description:
      'Un événement (opéra, concert, spectacle, match…) est retransmis en direct sur l’écran du cinéma.',
  },
  ATELIER: {
    name: 'Ciné-atelier',
    description:
      'La projection est accompagnée d’un atelier, avant ou après le film, pour découvrir ou pratiquer une activité.',
  },
  ANIMATION_15_25: {
    name: 'Animation 15-25',
    description:
      'La séance est accompagnée d’une animation pensée pour les 15-25 ans, avant ou après le film.',
  },
  PUBLIC_ADAPTE: {
    name: 'Public adapté',
    description:
      'La séance est aménagée pour un public particulier (personnes en situation de handicap, tout-petits…)\u00a0: projection et accueil adaptés. Détails auprès du cinéma.',
  },
  CINE_CLUB: {
    name: 'Ciné-Club',
    description:
      'Séance organisée par un ciné-club\u00a0: le film est souvent présenté avant la projection et discuté après.',
  },
  FESTIVAL: {
    name: 'Festival',
    description: 'La séance fait partie d’un festival de cinéma.',
  },
  CINE_RELAX: {
    name: 'Ciné Relax',
    description:
      'Séance au son modéré et à la lumière douce, où chacun peut bouger et réagir librement. Pensée pour les personnes en situation de handicap, ouverte à tout le monde.',
  },
}

const subtitleCcap: AccessibilityDetailContent = {
  name: 'Sous-titré CCAP',
  description:
    'Sous-titres pour personnes sourdes ou malentendantes, affichés sur un petit écran individuel ou des lunettes fournis par le cinéma.',
  category: 'audio',
}

const audioDescriptionGreta: AccessibilityDetailContent = {
  name: 'Audio description Greta',
  description: 'Audio Description, disponible avec l’application Greta.',
  category: 'visual',
}

export const ACCESSIBILITY: Record<string, AccessibilityDetailContent> = {
  SUBTITLE_CCAP: subtitleCcap,
  CCAP: subtitleCcap,
  AUDIO_HI: {
    name: 'Ecoute Assistée',
    description:
      'Le son du film, avec des dialogues plus clairs, est diffusé dans un casque fourni par le cinéma.',
    category: 'audio',
  },
  STSME: {
    name: 'ST-SME',
    description:
      'Sous-titres sur le grand écran pour personnes sourdes ou malentendantes\u00a0: dialogues, nom de qui parle, bruits et musique.',
    category: 'audio',
  },
  BOUCLE_MAG: {
    name: 'Boucle Magnétique',
    description:
      'Le son du film est transmis directement dans les appareils auditifs réglés sur la position T. Pour les personnes malentendantes appareillées.',
    category: 'audio',
  },
  RENFO_SONORE: {
    name: 'Renforcement sonore',
    description:
      'Le son du film est amplifié pour les personnes malentendantes, avec un casque ou une application. L’équipement est à demander au cinéma.',
    category: 'audio',
  },
  AUDITION: {
    name: 'Accessible aux personnes en situation de handicap auditif',
    description:
      'Séance accessible aux personnes sourdes ou malentendantes. Les équipements proposés sont à demander au cinéma.',
    category: 'audio',
  },
  RELAX: {
    name: 'Ciné Relax',
    description:
      'Séance au son modéré et à la lumière douce, où chacun peut bouger et réagir librement. Pensée pour les personnes en situation de handicap, ouverte à tout le monde.',
    category: 'mental',
  },
  COGNITIF: {
    name: 'Accessible aux personnes en situation de handicap cognitif',
    description:
      'Séance accessible aux personnes avec un handicap cognitif (mémoire, attention, compréhension). Les aménagements sont à demander au cinéma.',
    category: 'mental',
  },
  PMR: {
    name: 'Accès PMR',
    description: 'Salle accessible en fauteuil roulant, avec des places réservées.',
    category: 'motor',
  },
  MOBILITE: {
    name: 'Accessible aux personnes en situation de handicap moteur',
    description:
      'Séance accessible aux personnes à mobilité réduite ou en situation de handicap moteur. Les aménagements sont à demander au cinéma.',
    category: 'motor',
  },
  AUDIO_DESCRIPTION: {
    name: 'Audio Description',
    description:
      'Audio Description. Une voix décrit ce qui se passe à l’écran, entre les dialogues, pour les personnes aveugles ou malvoyantes.',
    category: 'visual',
  },
  VAST: {
    name: 'VAST',
    description: 'Version Audio Sous-Titrée. Une voix lit les sous-titres d’un film en VO.',
    category: 'visual',
  },
  VISION: {
    name: 'Accessible aux personnes en situation de handicap visuel',
    description:
      'Séance accessible aux personnes aveugles ou malvoyantes. Les équipements proposés sont à demander au cinéma.',
    category: 'visual',
  },
  AD_GRETA: audioDescriptionGreta,
  GRETA: audioDescriptionGreta,
}
