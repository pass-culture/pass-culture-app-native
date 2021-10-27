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
      name: 'Lycée Jean Monnet',
      city: 'La Queue-lez-Yvelines',
    },
    {
      name: 'Lycée Robert Doisneau',
      city: 'Corbeil-Essonnes',
    },
    {
      name: 'Lycée Emmanuel Mounier',
      city: 'Châtenay-Malabry',
    },
    {
      name: 'Collège Jacques Daguerre',
      city: 'Cormeilles-en-Parisis',
    },
    {
      name: 'Lycée Gustave Monod',
      city: 'Enghien-les-Bains',
    },
  ],
  [SchoolAcademyEnum.RENNES]: [
    {
      name: 'Collège Prévert Gimguamp',
      city: 'Guingamp',
    },
    {
      name: 'Lycée Auguste Pavie',
      city: 'Guingamp',
    },
    {
      name: 'Lycée Rosa Parks',
      city: 'Rostrenen',
    },
    {
      name: 'Lycée Pont de Buis',
      city: 'Pont-de-Buis-lès-Quimerch',
    },
    {
      name: 'Collège Aux quatre vents',
      city: 'Lanmeur',
    },
    {
      name: 'Lycée Saint Esprit',
      city: 'Landivisiau',
    },
    {
      name: 'Collège Notre Dame de Penhors',
      city: 'Pouldreuzic',
    },
    {
      name: 'Lycée Maupertuis',
      city: 'Saint-Malo',
    },
    {
      name: 'Collège Beaumont Redon',
      city: 'Redon',
    },
    {
      name: 'Lycée Beaumont Redon',
      city: 'Redon',
    },
    {
      name: 'Lycée Jean Marie de la Mennais',
      city: 'Ploërmel',
    },
    {
      name: 'Lycée Louis Armand',
      city: 'Locminé',
    },
    {
      name: 'Collège Max Jacob',
      city: 'Josselin',
    },
    {
      name: 'Collège Emile Maze',
      city: 'Guémené-sur-Scorff',
    },
    {
      name: 'Collège Jean le Coutaller',
      city: 'Lorient',
    },
  ],
}
