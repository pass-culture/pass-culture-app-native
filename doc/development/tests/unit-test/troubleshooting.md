# Test troubleshooting

Ce fichier sert à regrouper tous les soucis que vous pouvez avoir pendant vos tests, et les potentielles solutions.

## Les act warning

```
Warning: An update to ChangeEmail inside a test was not wrapped in act(...).
```

Il y a plusieurs hack pour résoudre cette erreur :

1. Ajouter un `await act(async () => {})` après la fonction de render ou autour d'un `fireEvent`

2. Dans le cas d'un formulaire avec une input en `autofocus` il faut attendre que celle-ci soit en effet focus car cela se fait de manière asynchrone. Exemple dans les tests de perf :

```
it('should not have basic accessibility issues', async () => {
      mockV4.mockReturnValueOnce('emailInput').mockReturnValueOnce('passwordInput')
      const { container } = render(<ChangeEmail />)

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
```
