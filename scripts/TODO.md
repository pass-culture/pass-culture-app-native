Possibles solutions pour ignorer l'utilisation de StaticMode de React :

- [ ] Utiliser "transform: {}" dans le package.json > ❌
  - Lien : https://stackoverflow.com/questions/72950875/how-to-disable-use-strict-in-jest
- [ ] Wrapper le render des tests dans un await act() > ❌
  - Lien : Chatgpt
- [ ] Ajouter "export ENVIRONMENT='production'" dans le script reassure-test > ❌
  - Lien : Idée de Bruno
- [ ] Tester l'idée suivante :
  ```if (process.env.REACT_APP_PERFORMANCE_TEST) {
      ReactDOM.render(<App />, document.getElementById('root'));
      } else {
      ReactDOM.render(
      <React.StrictMode>
      <App />
      </React.StrictMode>,
      document.getElementById('root')
      );
      }
  ```
