
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

- ➕Import
## Layout

- ✅ Logo
- ✅ Rencontre et pokedex
- ✅ Badge + progress bar
- ✅ Reset Game

- ➕Export

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

- ➕Attack (calcul des dommages reciproques)
- ➕X Capture(en fonction des pv) pas finis, 50% capture ou subit une attaque
- ➕P✅ wild et pokemon perso (bug sur progress bar)
- ➕close (implementation pour test)
- ➕run (50% run et nouveau random ou subir une attaque)

- ➕wild meurt si HP < 0 => evolution (5%)
- ➕pokemon team meurt => disparait de l'equipe et du pokedex 
- ➕si team vide redirigé vers bank
- ➕si bank vide game over screen


## Pokedex + Team

### Pokedex 

#### Affichage

- ✅ 151 Pokemon afficher par defaut
- ✅ Progression badge + bar
- ✅ Grille , responsive ?
- ✅ ➕Pokemon nom, numero et couleur si capturé ou vu
- ✅ ➕Pokemon numero et noir si ni vu ni capturé
- ✅ Click vers detail si capturé ou vu
- ➕Dragable vers team si capturé

#### Filtre

- ✅ Barre de recherche
- ✅ Bouton "tous" | "capturé" | "non capturé"
- ✅ ➕Filtre par type
- V ➕Compteur par type

### Equipe

- ✅ ➕Drag pour ajouter a l'equipe (inferieur a 6)
- V 6 slot fixe
- V Slot vide
- V Retirer (si pas dernier)

### Detail

- V Image,nom ,id, type
- V progress bar (bug sur le %)
- V "+" Radar

- "+" Resistance/Vulnerabilités
- V action retirer si equipe, ajouter si bank
- V Bouton retour
- "+" test pour tester

## Aller plus loin

- V Selection du pokemon dans l'equipe (et apercu)
- V Debut de logique de combat (quelques bug residuel du a l'implementation de current HP)
- X Pas gerer le type de l'attaqu
- V calcul des dommages
- V barre de progression combat pas finis
- X animation d'attaque
- X victoire / % degats chance augmenté pas implémenté

## Test

**les tests qui ne sont pas ecris passe !** et ce qui n'a pas été detiallé plus tot l'est ici

- V réorganisaiton équipe
- X note pas de guard sur changement de l'id si non capturé !

## Amélioration sugérées

- X pas d'amelioration de design
- X pas de tri dans la bank (asc,desc...)
- X pas de stats détaillé
- X pas de badges de succes
- X pas de notes personnelles sur les pokemons

- "+" ajout de pop up sur evolution
- "+" total attempt capture
- "+" localstorage 

















