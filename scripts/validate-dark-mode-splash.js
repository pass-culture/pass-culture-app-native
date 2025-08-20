#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..')

console.log('🔍 Validation de la configuration Dark Mode Splashscreen\n')

// Vérification iOS
console.log('📱 iOS:')
const iosImagesetPath = path.join(PROJECT_ROOT, 'ios', 'PassCulture', 'Images.xcassets', 'SplashImage.imageset')
const iosContentsPath = path.join(iosImagesetPath, 'Contents.json')

if (fs.existsSync(iosContentsPath)) {
  const contents = JSON.parse(fs.readFileSync(iosContentsPath, 'utf8'))
  const hasLightImages = contents.images.some(img => img.appearances && img.appearances[0].value === 'light')
  const hasDarkImages = contents.images.some(img => img.appearances && img.appearances[0].value === 'dark')
  
  console.log(`  ✅ Contents.json configuré`)
  console.log(`  ${hasLightImages ? '✅' : '❌'} Images mode clair configurées`)
  console.log(`  ${hasDarkImages ? '✅' : '❌'} Images mode sombre configurées`)
  
  // Vérification des fichiers images
  const darkImages = ['splash_dark@1x.png', 'splash_dark@2x.png', 'splash_dark@3x.png']
  const lightImages = ['splash@1x.png', 'splash@2x.png', 'splash@3x.png']
  
  darkImages.forEach(img => {
    const exists = fs.existsSync(path.join(iosImagesetPath, img))
    console.log(`  ${exists ? '✅' : '❌'} ${img}`)
  })
} else {
  console.log('  ❌ Contents.json non trouvé')
}

// Vérification Android
console.log('\n🤖 Android:')

// Vérification values-night
const valuesNightPath = path.join(PROJECT_ROOT, 'android', 'app', 'src', 'main', 'res', 'values-night', 'colors-splash.xml')
if (fs.existsSync(valuesNightPath)) {
  console.log('  ✅ values-night/colors-splash.xml créé')
  const content = fs.readFileSync(valuesNightPath, 'utf8')
  const hasDarkColor = content.includes('#161617')
  console.log(`  ${hasDarkColor ? '✅' : '❌'} Couleur sombre configurée`)
} else {
  console.log('  ❌ values-night/colors-splash.xml manquant')
}

// Vérification drawable-night
const drawableNightPath = path.join(PROJECT_ROOT, 'android', 'app', 'src', 'main', 'res', 'drawable-night', 'splash_background.xml')
if (fs.existsSync(drawableNightPath)) {
  console.log('  ✅ drawable-night/splash_background.xml créé')
} else {
  console.log('  ❌ drawable-night/splash_background.xml manquant')
}

// Vérification styles.xml
const stylesPath = path.join(PROJECT_ROOT, 'android', 'app', 'src', 'main', 'res', 'values', 'styles.xml')
if (fs.existsSync(stylesPath)) {
  const stylesContent = fs.readFileSync(stylesPath, 'utf8')
  const hasBackground = stylesContent.includes('@drawable/splash_background')
  console.log(`  ${hasBackground ? '✅' : '❌'} styles.xml configuré avec splash_background`)
} else {
  console.log('  ❌ styles.xml non trouvé')
}

console.log('\n🎯 Prochaines étapes:')
console.log('1. Remplacez splash_dark@1x.png, splash_dark@2x.png, splash_dark@3x.png par vos vraies images sombres')
console.log('2. Testez sur simulateur/émulateur avec les deux modes')
console.log('3. Lancez: yarn ios:testing ou yarn android:testing')

console.log('\n✨ Configuration terminée!')