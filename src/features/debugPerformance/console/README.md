# Console Interface Debug Performance

## Utilisation

L'interface console `window.debugPerf` est automatiquement disponible en mode développement.

### Commandes de base

```javascript
window.debugPerf.start()   // Démarre l'enregistrement
window.debugPerf.stop()    // Arrête l'enregistrement  
window.debugPerf.stats()   // Affiche les statistiques
window.debugPerf.export()  // Exporte les données
window.debugPerf.clear()   // Efface les données
window.debugPerf.config()  // Configuration
```

## Options de logging

### Activation des logs de debug

```bash
# Dans le terminal ou .env
DEBUG_PERFORMANCE_LOGS=true yarn start:web
```

Affiche les logs de debug détaillés avec préfixe `[DEBUG]`

### Activation de la sortie console verbose

```bash
# Dans le terminal ou .env  
DEBUG_PERFORMANCE_VERBOSE=true yarn start:web
```

Affiche tous les détails des commandes et listes complètes

### Combinaison des options

```bash
# Pour un debug complet
DEBUG_PERFORMANCE_LOGS=true DEBUG_PERFORMANCE_VERBOSE=true yarn start:web
```

## Niveaux de logging

- **info** : Messages essentiels toujours affichés
- **error** : Erreurs toujours affichées  
- **debug** : Détails techniques (avec DEBUG_PERFORMANCE_LOGS=true)
- **verbose** : Informations détaillées (avec DEBUG_PERFORMANCE_VERBOSE=true)

## Export programmatique

```javascript
import { logger } from 'features/debugPerformance'

logger.info('Message utilisateur important')
logger.debug('Détail technique de debug')
logger.verbose('Information détaillée')
logger.error('Erreur à signaler')
```

## Migration des console.log existants

Pour nettoyer le code existant, remplacez progressivement :

```javascript
// À remplacer (console.log direct)
console.log('[Debug] Something happened')
console.error('Error occurred')

// Par (logger conditionnel)
import { logger } from '../utils/logger'
logger.debug('Something happened')
logger.error('Error occurred')
```

### Guide de migration

1. **Messages d'erreur** : `console.error()` → `logger.error()`
2. **Debug interne** : `console.log('[Debug]...')` → `logger.debug()`  
3. **Info utilisateur** : `console.log('Important info')` → `logger.info()`
4. **Détails verbeux** : `console.log('Detailed info')` → `logger.verbose()`
5. **Anciens logs** : `console.log()` → `logger.deprecatedLog()` (temporaire)

### Désactivation complète des logs

```bash
# Aucun log de debug (seuls info et error)
DEBUG_PERFORMANCE_LOGS=false DEBUG_PERFORMANCE_VERBOSE=false yarn start:web
```