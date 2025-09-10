# Guide des Commandes Debug Performance

## 🔧 Interface Console

L'interface `window.debugPerf` est automatiquement disponible dans le navigateur lorsque l'app est en mode développement.

### 📋 Commandes Disponibles

#### 1. **window.debugPerf.help()**
Affiche la documentation complète de toutes les commandes disponibles.

#### 2. **window.debugPerf.start()**
Démarre l'enregistrement des performances.
- Active le monitoring des requêtes réseau
- Active le tracking des renders React  
- Active la surveillance des performances de listes
- Crée une nouvelle session avec un ID unique

#### 3. **window.debugPerf.stop()**
Arrête l'enregistrement en cours.
- Sauvegarde toutes les métriques collectées
- Affiche la durée de la session
- Prépare les données pour l'export

#### 4. **window.debugPerf.stats()**
Affiche les statistiques de la session courante.
- Métriques temps réel si enregistrement actif
- Nombre de requêtes, renders, listes surveillées
- Dernières requêtes réseau
- Utilisation de stockage

#### 5. **window.debugPerf.export()**
Exporte les données collectées.
- **Web**: Télécharge un fichier JSON
- **React Native**: Affiche les données dans la console à copier
- Contient toutes les métriques de la session

#### 6. **window.debugPerf.clear()**
Efface toutes les données stockées.
- Supprime toutes les sessions précédentes
- Libère l'espace de stockage
- **Attention**: Action irréversible!

#### 7. **window.debugPerf.config()**
Affiche la configuration actuelle du système.
- État des différents monitors
- Limites de stockage et rétention
- Paramètres actifs

#### 8. **window.debugPerf.logs(level)**
Contrôle le niveau de logs affiché.

**Niveaux disponibles:**
- `"off"` - Désactive tous les logs verbeux
- `"info"` - Messages essentiels uniquement  
- `"debug"` - Active les logs détaillés
- `"verbose"` - Active tous les logs (très détaillé)

**Exemples:**
```javascript
window.debugPerf.logs()            // Affiche l'état actuel
window.debugPerf.logs("debug")     // Active le mode debug
window.debugPerf.logs("verbose")   // Mode très détaillé
window.debugPerf.logs("off")       // Désactive logs verbeux
```

## 🚀 Workflow Recommandé

### Démarrage Rapide
```javascript
// 1. Démarrer l'enregistrement
window.debugPerf.start()

// 2. Utiliser l'app normalement
// [Navigation, scrolling, interactions...]

// 3. Vérifier les métriques
window.debugPerf.stats()

// 4. Exporter les données
window.debugPerf.export()
```

### Debug Avancé
```javascript
// Activer logs détaillés
window.debugPerf.logs("verbose")

// Démarrer monitoring 
window.debugPerf.start()

// Observer les logs en temps réel dans la console
// Les requêtes, renders, performances s'affichent automatiquement

// Analyser avec stats()
window.debugPerf.stats()
```

## 🎯 Surveillance Active

L'interface surveille automatiquement:

### 🌐 Requêtes Réseau
- Tous les appels `fetch()` et `XMLHttpRequest`
- Temps de réponse, taille, codes de statut
- Catégorisation automatique (API, assets, CDN...)

### 🎨 Performance React
- Temps de render de chaque composant
- Détection des re-renders fréquents
- Arbre des composants et relations

### 📋 Performance des Listes
- FlatList et FlashList monitoring
- Métriques de scroll, FPS
- Détection des éléments vides et lents

### 💾 Utilisation Mémoire
- Suivi de l'utilisation mémoire
- Détection des pics et fuites potentielles

## 🔧 Variables d'Environnement

Contrôlez les logs via les variables d'environnement:

```bash
# Active les logs de debug
DEBUG_PERFORMANCE_LOGS=true

# Active tous les logs (très verbeux)  
VERBOSE_PERFORMANCE_CONSOLE=true
```

**Note**: Redémarrez l'application après modification des variables d'environnement.

## 📊 Format d'Export

Les données exportées incluent:

```json
{
  "sessionId": "session_1640000000000_abc123",
  "startTime": "2023-12-20T10:00:00.000Z",
  "endTime": "2023-12-20T10:05:00.000Z",
  "duration": 300000,
  "deviceInfo": {
    "platform": "web",
    "userAgent": "...",
    "screen": {...}
  },
  "metrics": {
    "networkRequests": 45,
    "renderEvents": 128,
    "listPerformance": 8,
    "totalMemoryUsageMB": 24.5
  },
  "status": "stopped"
}
```

## 🛠️ Développement

### Ajout de Composants de Test

```typescript
import { TestConsoleInterface } from 'src/features/debugPerformance'

// Dans votre page de dev
<TestConsoleInterface />
```

### Intégration Personnalisée

```typescript
import { ConsoleInterface } from 'src/features/debugPerformance'

// Accès direct à l'interface
const consoleInterface = ConsoleInterface.getInstance()
```