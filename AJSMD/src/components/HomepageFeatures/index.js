import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Règles de gestions',
    Svg: require('@site/static/img/mountain.svg').default,
    description: (
      <>
        Comprendre la couverture des tests unitaires et E2E, les bonnes pratiques.
      </>
    ),
  },
  {
    title: 'Résumé des tests',
    Svg: require('@site/static/img/tree.svg').default,
    description: (
      <>
       'Disposez d'un résumé de vos tests unitaires et E2E, <code>docs</code>.''
      </>
    ),
  },
  {
    title: 'Base de connaissance',
    Svg: require('@site/static/img/react.svg').default,
    description: (
      <>
        Fini les recherches compliquées, vous pouvez rechercher par fonctionnalité par parcours utilisateurs et même par mot.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
