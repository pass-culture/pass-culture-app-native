# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/dora)

---

## Tasks

- [x] avoir des lieux (hardcodés ou réels)
- [ ] Présentation regroupement des pins
- [ ] Regroupement des pins = Clusteriser les marqueurs (qu'est ce qui peut être fait ?)
      Afficher plusieurs pins,
      nous avons déjà un pin customiser (une view avec une icone),
      On peut les clusteriser (avec une autre lib : react-native-map-clustering : https://github.com/venits/react-native-map-clustering , supercluster : https://github.com/mapbox/supercluster)
      Faire du rechargement automatique quand on se balade sur la carte ou bien en sortie de zone
- [ ] Définition nombre maximal de pin visibles
  - ça on peut dans la lib
- [ ] Comportement au zoom, dézoom: est ce que la lib propose un debounce
- [ ] Afficher un marqueur custom (icone)
- [ ] Prévisualisation des pages lieux dans la carte
- [ ] Voir ce que fait la lib quand elle a 2 lieux au même endroit

---

## Tasks for another US

- [ ] Android ?
- [ ] Web ?
  - [ ] Web Mobile ?
  - [ ] Web Desktop ?
- pour Henri
  - [ ] DPO fournisseur de carte (google / apple)
    - [ ] OpenStreetMap ?
  - [ ] en fonction des filtres de la requete de lieux, si on clusturise et qu'on dézoom au max, on pourrait avoir un nombre plus petit que ce qui est officiellement annoncé
