export type School = {
  name: string
  city: string
}

const SchoolAcademyEnum = {
  RENNES: 'Rennes',
  VERSAILLES: 'Versailles',
}

export const eligibleSchools = {
  [SchoolAcademyEnum.VERSAILLES]: [
    {
      name: 'Collège Flora Tristan',
      city: 'Carrières-sous-Poissy',
    },
    {
      name: 'Lycée Emmanuel Mounier',
      city: 'Châtenay-Malabry',
    },
    {
      name: 'Lycée Robert Doisneau',
      city: 'Corbeil-Essonnes',
    },
    {
      name: 'Collège Jacques Daguerre',
      city: 'Cormeilles-en-Parisis',
    },
    {
      name: 'Lycée Gustave Monod',
      city: 'Enghien-les-Bains',
    },
    {
      name: 'Lycée Jean Monnet',
      city: 'La Queue-lez-Yvelines',
    },
  ],
  [SchoolAcademyEnum.RENNES]: [
    {
      name: 'Collège Emile Mazé',
      city: 'Guémené-sur-Scorff',
    },
    {
      name: 'Collège Jacques Prévert',
      city: 'Guingamp',
    },
    {
      name: 'Lycée Auguste Pavie',
      city: 'Guingamp',
    },
    {
      name: 'Collège Max Jacob',
      city: 'Josselin',
    },
    {
      name: 'Lycée Saint Esprit',
      city: 'Landivisiau',
    },
    {
      name: 'Collège Aux quatre vents',
      city: 'Lanmeur',
    },
    {
      name: 'Lycée Louis Armand',
      city: 'Locminé',
    },
    {
      name: 'Collège Jean le Coutaller',
      city: 'Lorient',
    },
    {
      name: 'Lycée La Mennais (Jean-Marie)',
      city: 'Ploërmel',
    },
    {
      name: 'Lycée Pont de Buis',
      city: 'Pont-de-Buis-lès-Quimerch',
    },
    {
      name: 'Collège Notre Dame de Penhors',
      city: 'Pouldreuzic',
    },
    {
      name: 'Lycée Beaumont',
      city: 'Redon',
    },
    {
      name: 'Collège Beaumont',
      city: 'Redon',
    },
    {
      name: 'Lycée Rosa Parks',
      city: 'Rostrenen',
    },
    {
      name: 'Lycée Maupertuis',
      city: 'Saint-Malo',
    },
  ],
}
