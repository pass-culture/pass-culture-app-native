# Commit bonnes pratiques

## Martin Fowler (Refactoring) :

"Each commit should be a small, atomic 
  step. If you need to revert, you revert one
  step, not the whole feature."

## Kent Beck (Extreme Programming) :

"Commit whenever you have something that 
  compiles and passes tests."

## Uncle Bob (Clean Code) :

"A commit should tell a story. Multiple 
  commits tell the journey."

> L'Idéal : 2-5 commits atomiques par PR

## Chaque commit doit :

1. ✅ Compiler sans erreurs
2. ✅ Passer tous les tests
3. ✅ Être réversible individuellement
4. ✅ Raconter une étape logique

Les commits vont être écrasés à la fin de la PR mais avant la PR ces directives permettent de comprendre plus facilement le chemin parcouru par le développeur, et l'histoire qu'il veut raconter.
