
# PokemonGame

## Starter

### Affichage

- ✅ choix du pokemon de depart
- ✅ 3 Pokemon Bulbizare,Salameche,Carapuce
- ✅ image officielle , nom nid et type

### Intercation 

- ❌ Pas de boutonn choisir => click sur la carte du pokemon pour chosir

- ✅ Ajoute le starter a l'equipe
- ✅ Sauvegarde dans GameService
- ✅ Redirection vers encounter

- ➕ Import
## Layout

- ✅ Logo
- ✅ Rencontre et pokedex
- ✅ Badge + progress bar
- ✅ Reset Game

- ➕ Export

## Encounter

### Affichage

- ✅ Pokemon aleatoire
- ✅ Sprite
- ✅ Nom et Numéro
- ✅ Type

- ❌ Niveau
- ❌ Voir detail

### Interaciton 

- ✅ Run (new random pokemon)
- ✅ Catch 50%
- ✅ Message bravo tu as capturé 'pokemon' + "deja capturé" ou "ajouté a la banque"
- ✅ message 'pokemon' s'est echappé
- ✅ Si capturé : ajoute a la bank et a l'equipe si il y a de la place

- ❌ pas de bouton reesayer

### Fight

- ➕ Attack (calcul des dommages reciproques)
- ➕ ❌ Capture(en fonction des pv) pas finis, 50% capture ou subit une attaque
- ➕ P✅ wild et pokemon perso (bug sur progress bar)
- ➕ close (implementation pour test)
- ➕ run (50% run et nouveau random ou subir une attaque)

- ➕ wild meurt si HP < 0 => evolution (5%)
- ➕ pokemon team meurt => disparait de l'equipe et du pokedex
- ➕ si team vide redirigé vers bank
- ➕ si bank vide game over screen


## Pokedex + Team

### Pokedex 

#### Affichage

- ✅ 151 Pokemon afficher par defaut
- ✅ Progression badge + bar
- ✅ Grille , responsive ?
- ✅ ➕ Pokemon nom, numero et couleur si capturé ou vu
- ✅ ➕ Pokemon numero et noir si ni vu ni capturé
- ✅ Click vers detail si capturé ou vu
- ➕ Dragable vers team si capturé

#### Filtre

- ✅ Barre de recherche
- ✅ Bouton "tous" | "capturé" | "non capturé"
- ✅ ➕ Filtre par type
- ✅ ➕ Compteur par type

### Equipe

- ✅ ➕ Drag pour ajouter a l'equipe (inferieur a 6)
- ✅ 6 slot fixe
- ✅ Slot vide
- ✅ Retirer (si pas dernier)

### Detail

- ✅ Image,nom ,id, type
- ✅ progress bar (bug sur le %)
- ✅ ➕  Radar

- ➕  Resistance/Vulnerabilités
- ✅ action retirer si equipe, ajouter si bank
- ✅ Bouton retour
- ➕  test pour tester

## Aller plus loin

- ✅ Selection du pokemon dans l'equipe (et apercu)
- ✅ Debut de logique de combat (quelques bug residuel du a l'implementation de current HP)
- ❌ Pas gerer le type de l'attaqu
- ✅ calcul des dommages
- ✅ barre de progression combat pas finis
- ❌ animation d'attaque
- ❌ victoire / % degats chance augmenté pas implémenté

## Test

**les tests qui ne sont pas ecris passe !** et ce qui n'a pas été detiallé plus tot l'est ici

- ✅ réorganisaiton équipe
- ❌ note pas de guard sur changement de l'id si non capturé !

## Amélioration sugérées

- ❌ pas d'amelioration de design
- ❌ pas de tri dans la bank (asc,desc...)
- ❌ pas de stats détaillé
- ❌ pas de badges de succes
- ❌ pas de notes personnelles sur les pokemons

- ➕  ajout de pop up sur evolution
- ➕  total attempt capture
- ➕  localstorage 

















