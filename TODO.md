# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/decouverte)

---

## Tasks

- [x] avoir des lieux (hardcodés ou réels)
- [x] Présentation regroupement des pins
- [x] Regroupement des pins = Clusteriser les marqueurs (qu'est ce qui peut être fait ?)
      Afficher plusieurs pins,
      nous avons déjà un pin customiser (une view avec une icone),
      On peut les clusteriser (avec une autre lib : react-native-map-clustering : https://github.com/venits/react-native-map-clustering , supercluster : https://github.com/mapbox/supercluster)
      Faire du rechargement automatique quand on se balade sur la carte ou bien en sortie de zone
- [ ] Déterminer le minimum de pins pour le cluster
  - impact sur le minpoint et radius (finetuning avec les données de prod à prévoir)
- [ ] Définition nombre maximal de pin visibles
  - ça on peut dans la lib
- [x] refetch dans la zone où on se trouve
- [ ] Comportement au zoom, dézoom: est ce que la lib propose un debounce
- [x] Afficher un marqueur custom (icone)
- [ ] Prévisualisation des pages lieux dans la carte
- [x] Voir ce que fait la lib quand elle a 2 lieux au même endroit

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
    - [ ] lorsqu'il y a plus de 1000 de lieux : afficher 1000+ au lieu du nombre exacte ?
    - [ ] lorsque le zoom est trop dézoomé (on voit la terre entière par exemple) on n'affiche plus les lieux ?
