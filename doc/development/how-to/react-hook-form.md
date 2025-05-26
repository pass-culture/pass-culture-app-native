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

  await expect(result).rejects.toEqual(new ValidationError('1 Caractère spécial (!@#$%^&*...)'))
})
```

### Tester le formulaire dans les composants

⚠️ Dans les tests avec react hook form, le comportement demande à ce qu’on wrap tous les fireEvent dans des act, afin de ne pas avoir d’act warning qui font fail les tests.

Exemple avec un test de ChangeEmail :

```tsx
render(<ChangeEmail />)
const submitButton = screen.getByLabelText('Enregistrer les modifications')
expect(submitButton).toBeDisabled()

await act(async () => {
  const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
  fireEvent.changeText(passwordInput, 'password>=12')
})
await act(async () => {
  const emailInput = screen.getByTestId('Entrée pour l’email')
  fireEvent.changeText(emailInput, 'EMAIL@domain.ext')
})
expect(submitButton).toBeDisabled()

const errorMessage = screen.getByText('L’e-mail saisi est identique à ton e-mail actuel')
expect(errorMessage).toBeOnTheScreen()
```

## Liens externes

Pour tout ce qui est des paramètres et des valeurs de retours du hook `useForm`, [la doc de react-hook-form](https://react-hook-form.com/docs/useform) est très précise à ce sujet.

Il y a une subtilité qu'il est important d'avoir en tête :

- `getValues` : récupère la valeur mais sans trigger de re-render au moment ou celle-ci change

- `watch` : récupère la valeur et trigger un re-render au moment à chaque fois que celle-ci change
