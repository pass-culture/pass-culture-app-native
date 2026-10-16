# React-hook-form

## Les composants réutilisables

### Les controllers

On les trouve dans `src/shared/forms/controllers`.

Ils servent à être utiliser dans les formulaires utilisant react-hook-form et remplacent les inputs classiques.

### Les schemas

On les trouve dans `src/shared/forms/schemas`.

Ils regroupent des règles de validation classique qu'on retrouve à plusieurs endroits de l'application comme les mots de passe ou adresse email et peuvent être utiliser dans d'autres schemas de cette manière-ci :

```ts
export const setEmailSchema = object()
  .shape({
    email: emailSchema.required('L’email est obligatoire'),
  })
  .required()
```

## Tester un formulaire

### Tester le schema yup

Pour tester un schema yup, il faut passer par la fonction validate du schema, le résultat vaut soit la valeur d'entrée dans le cas ou le schema est valide, soit rejects avec le message d'erreur dans le cas où le schema n'est pas valide.

```tsx
it('must follow all security rules', async () => {
  const value = 'user@AZERTY123'
  const result = await passwordSchema.validate(value)

  expect(result).toEqual(value)
})

it('must have at least 1 special character', async () => {
  const value = 'userAZERTY123'
  const result = passwordSchema.validate(value)

  await expect(result).rejects.toEqual(new ValidationError('1 caractère spécial (!@#$%^&*...)'))
})
```

### Tester le formulaire dans les composants

⚠️ La validation de react-hook-form est asynchrone. Pour éviter les act warnings, utiliser `userEvent` (`user.type`, `user.press`) et attendre le résultat avec `await screen.findBy...`, plutôt que de wrapper chaque interaction dans un `act`.

Exemple avec un test de NewEmailSelection :

```tsx
const user = userEvent.setup()

it('should display invalid email format when email format is invalid', async () => {
  await renderAsync(reactQueryProviderHOC(<NewEmailSelection />))

  const emailInput = screen.getByTestId('Entrée pour l’email')
  await user.type(emailInput, 'john.doe')

  expect(
    await screen.findByText(
      'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr',
      { hidden: true }
    )
  ).toBeOnTheScreen()
})
```

## Liens externes

Pour tout ce qui est des paramètres et des valeurs de retours du hook `useForm`, [la doc de react-hook-form](https://react-hook-form.com/docs/useform) est très précise à ce sujet.

Il y a une subtilité qu'il est important d'avoir en tête :

- `getValues` : récupère la valeur mais sans trigger de re-render au moment ou celle-ci change

- `watch` : récupère la valeur et trigger un re-render du composant qui appelle `useForm` à chaque fois que celle-ci change

- `useWatch` : comme `watch`, mais limite le re-render au composant qui l'appelle (à préférer dans un sous-composant)
