# Comment créer une règle ESLint custom

## Mode opératoire

En cas de doute, la règle [use-the-right-test-utils](../eslint-custom-rules/use-the-right-test-utils.js) est bon exemple de règle ESLint custom.

### 1. Vérifier qu'il n'y a pas une règle existante

Créer une règle custom a un coût, de part sa création, mais aussi par son maintien en place. Donc, s'il existe une règle existante (fournie par une lib elle-même par exemple), il est préférable de l'utiliser directement.

Sinon, continuer ce mode opératoire.

### 2. Créer une règle vide

- Créer un fichier JS dans `/eslint-custom-rules` et utiliser le snippet `eslint-rule` pour générer une règle vide.

- Dans [eslint-local-rules.js](../eslint-local-rules.js), importer sa règle du fichier créé, et l'exporter.

- Dans [.eslintrc.js](../.eslintrc.js), ajouter dans `rules` : `'local-rules/<ma-règle-ESLint>': ['error'],`

- Créer un fichier de test dans `/eslint-custom-rules/__tests__` : `<ma-règle-ESLint>.test.js`, et utiliser le snippet `eslint-rule-test` pour générer des tests à remplir.

### 3. Écrire une règle

L'écriture de règle ESLint en TDD est la meilleure approche : écrire d'abord un test, puis enrichir sa règle ESLint pour que le test passe, et réitérer.

Donc, dans un premier temps, ajouter un cas de test (valide ou invalide), lancer le test avec `yarn jest --watch <ma-règle-ESLint>`. Il devrait échouer.

Puis, pour améliorer la règle, il faut comprendre l'Abstract Syntax Tree (AST) du code du cas qu'on veut faire passer. C'est un arbre qui correspond à la syntaxe d'un code JavaScript donné. Cet AST est visualisable sur [AST Explorer](https://astexplorer.net/) : en écrivant du code à gauche, on peut le survoler avec son curseur, et visualiser la syntaxe à l'intérieur de son AST.

Une fois une particularité de notre cas identifiée, l'ajouter à la règle. Il y a 2 façons de faire :

- soit avec un sélecteur AST (préférable) : il s'agit de sélecteur semblable aux sélecteurs CSS.
Par exemple, `MemberExpression[object.name=clef][property.name=champs]` va exécuter son code si on rencontre le code `clef.champs`.
Plus d'informations [ici](https://eslint.org/docs/latest/extend/selectors#what-syntax-can-selectors-have).

- soit en manipulant l'AST à la main, en faisant des conditions nous-même.

Dans tous les cas, pour déclencher une erreur, il faut appeler `context.report({ node, message: "<message-d'erreur>" })`.

Réitérer cette étape 3, jusqu'à avoir une règle satisfaisante.

### (Bonus) Ajouter un autofix pour un cas d'erreur

Si on veut que la règle ESLint corrige automatiquement un cas d'erreur, il faut ajouter une fonction au champ `fix` à `context.report`, et lui faire retourner l'AST du code corrigé. Pour cela, il faut partir de l'AST erroné, et le modifier grâce aux utilitaires disponibles en paramètre (fixer). Par exemple, pour remplacer le texte du nœud `node`, catché par le sélecteur, par le code corrigé, il suffit de faire :

```js
context.report({
  node,
  message: "<message-d'erreur>",
  fix: fixer => {
    return fixer.replaceText(node, "<code-corrigé>");
  },
})
```

Toutes les utilitaires disponibles sont listés [ici](https://eslint.org/docs/latest/extend/custom-rules#applying-fixes).

Pour tester l'autofix, ajouter dans un cas invalide : `output: "<code-corrigé>"`.

### 4. Tester la règle en conditions réelles

Pour tester la règle dans le projet passCulture :

- lancer dans un terminal `yarn test:lint` ;

- ou dans VSCode : Cmd+Shift+P > `ESLint: Restart ESLint Server`, attendre quelques secondes, puis la nouvelle erreur sera visible dans les fichiers concernés.

## Ressources

- [Documentation ESLint sur les Custom rules](https://eslint.org/docs/latest/extend/custom-rules)
- [Documentation ESLint sur les sélecteurs](https://eslint.org/docs/latest/extend/selectors)
- [Visualiseur d'AST](https://astexplorer.net/)
