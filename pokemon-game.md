# 🎮 Projet Final : Jeu Pokémon avec PokéBuild API

## 📋 Contexte du projet

Vous devez développer un **jeu Pokémon complet** en Angular 20 utilisant l'API **PokéBuild API**. Le joueur commence par choisir son starter, puis peut explorer le monde pour rencontrer et capturer des Pokémon, gérer son équipe, sa banque et consulter son Pokédex.

---

## 🎯 Objectifs pédagogiques

- Consommer l'**API PokéBuild**
- Créer un **système de jeu** avec logique de capture
- Gérer un **état global** du joueur (Signals + Service)
- Implémenter une **architecture multi-pages** avec routing
- Créer des **interactions utilisateur** riches

---

## 🌐 PokéBuild API

### URL de base
```
https://pokebuildapi.fr/api/v1
```

### Endpoints principaux

#### 1. Récupérer tous les Pokémon
```
GET https://pokebuildapi.fr/api/v1/pokemon
```

#### 2. Récupérer un Pokémon par ID
```
GET https://pokebuildapi.fr/api/v1/pokemon/{id}
```

#### 3. Récupérer les Pokémon par génération
```
GET https://pokebuildapi.fr/api/v1/pokemon/generation/1
```

**Documentation** : https://pokebuildapi.fr/

---

## 📐 Architecture de l'application

### Structure des fichiers

```
src/app/
├── services/
│   ├── pokemon-api.service.ts
│   ├── game.service.ts
│   └── battle.service.ts
├── interfaces/
│   └── ipokemon.ts
└── guards/
│   └── starter-selected.guard.ts
│
├── pages/
│   ├── starter/
│   │   └── starter-selection.page.ts
│   │
│   ├── game/
│   │   ├── layout/
│   │   │   └── game-layout.component.ts
│   │   │
│   │   ├── encounter/
│   │   │   └── encounter.page.ts
│   │   │
│   │   ├── pokedex/
│   │   │   └── pokedex.page.ts
│   │   │
│   │   └── pokemon-detail/
│   │       └── pokemon-detail.page.ts
│   │
├── components/
│       ├── pokemon-card/
│       ├── pokemon-stats/
│       └── type-badge/
│
└── app.routes.ts
```

---

## ✅ Fonctionnalités à implémenter

### 🌟 Page 1 : Sélection du Starter (/)

#### Objectif
Choisir son premier Pokémon parmi les 3 starters de Génération 1.

#### Spécifications

**Affichage**
- [ ] Titre : "Choisis ton Pokémon de départ !"
- [ ] 3 cartes pour : **Bulbizarre** (ID: 1), **Salamèche** (ID: 4), **Carapuce** (ID: 7)
- [ ] Pour chaque starter :
  - Image officielle
  - Nom
  - Types (badges colorés)
  - Bouton "Choisir"

**Interactions**
- [ ] Click sur "Choisir" :
  - Ajouter le starter à l'équipe
  - Sauvegarder dans GameService
  - Rediriger vers `/game/encounter`

---

### 🏠 Layout du Jeu (/game)

#### Navigation
- [ ] Header avec :
  - Logo "Pokémon Game"
  - Liens : Rencontre | Pokédex
  - Badge : X/151 capturés
  - Bouton "Réinitialiser"

---

### 🎲 Page 2 : Rencontre (/game/encounter)

#### Concept
Un Pokémon aléatoire apparaît avec **50% de chances** de capture.

#### Spécifications

**Pokémon sauvage**
- [ ] Choisir aléatoirement un Pokémon Gen 1 (ID 1-151)
- [ ] Afficher :
  - Sprite officielle
  - Nom et numéro Pokédex
  - Types
  - Niveau aléatoire
  - Bouton "👁️ Voir détails" → Modal ou page détail

**Logique de capture**
```typescript
const captured = Math.random() < 0.5; // 50% de chances
```

**Actions**
- [ ] Bouton **"Lancer une Pokéball"** :
  - Animation de Pokéball
  - **Succès** :
    - Message : "✅ Bravo ! Tu as capturé [Nom] !"
    - Ajouter à la banque (date de capture)
    - Si équipe < 6 : Bouton "➕ Ajouter à l'équipe"
    - Bouton "🔄 Nouvelle rencontre"
  - **Échec** :
    - Message : "❌ [Nom] s'est échappé !"
    - Boutons : "🔄 Réessayer" | "🏃 Fuir"

- [ ] Bouton **"Fuir"** :
  - Génère un nouveau Pokémon

---

### 🏦 Page 3 : Pokédex et Équipe (/game/pokedex)

#### Concept
Page combinée avec le Pokédex (tous les 151 Pokémon) à gauche et l'équipe à droite.

#### Layout (2 colonnes)

**Pokédex (Gauche)**
- [ ] Afficher **tous les 151 Pokémon Gen 1**
- [ ] En-tête avec :
  - Progression : **X/151 capturés (Y%)**
  - Barre de progression visuelle
- [ ] Grille responsive (3-4 colonnes)
- [ ] Pour chaque Pokémon :
  - Numéro Pokédex : `#001`
  - **Si capturé** : Image en couleur + nom + bouton "➕"
  - **Si NON capturé** : Image avec `filter: brightness(0%)` + "???" + 🔒
- [ ] **Click sur carte** → Page détail (si capturé) ou message "Non capturé !"

**Filtres Pokédex**
- [ ] Barre de recherche (nom ou numéro)
- [ ] Boutons : "Tous" | "Capturés" | "Non capturés"
- [ ] Filtres par type (optionnel)

**CSS pour silhouettes**
```css
.pokemon-not-captured {
  filter: brightness(0%);
  opacity: 0.6;
}
```

**Équipe (Droite)**
- [ ] 6 slots fixes
- [ ] Slots occupés : Carte Pokémon avec actions
- [ ] Slots vides : "Vide"
- [ ] Bouton "🗑️ Retirer" renvoie le Pokémon dans le Pokédex (toujours visible mais retirable de l'équipe)

**Actions Pokédex**
- [ ] Click sur Pokémon capturé → "➕ Ajouter à l'équipe" (si < 6)
- [ ] Si équipe complète : "Équipe complète !"
- [ ] Click sur Pokémon non capturé → Aucune action possible

**Statistiques**
- [ ] Compteur par type : "Feu: 3/12 capturés" (optionnel)

---

### 📄 Page 4 : Détail Pokémon (/game/pokemon/:id)

#### Objectif
Afficher toutes les informations d'un Pokémon.

#### Spécifications

**En-tête**
- [ ] Image officielle (grande)
- [ ] Nom et #Pokédex
- [ ] Types

**Stats (affichage uniquement)**
- [ ] HP, Attaque, Défense, Att. Spé., Déf. Spé., Vitesse
- [ ] Barres de progression proportionnelles
- [ ] Total des stats
- [ ] Optionnel : Graphique radar

**Informations**
- [ ] Génération
- [ ] Date de capture (si capturé)
- [ ] Résistances aux types

**Actions (si capturé)**
- [ ] Si en banque : "➕ Ajouter à l'équipe"
- [ ] Si en équipe : "🗑️ Retirer"
- [ ] Bouton "← Retour"

---

## 🎁 Bonus : Combat au tour par tour (30 pts)

Si vous voulez aller plus loin, implémentez un système de combat réel :

### Fonctionnalités
- [ ] Avant la capture, **sélectionner un Pokémon de l'équipe**
- [ ] Combat au tour par tour (joueur → adversaire)
- [ ] 4 attaques générées selon le type (Feu : Flammèche, Lance-Flammes...)
- [ ] Calcul des dégâts :
  ```typescript
  const damage = (attaque * puissance * efficacité) / défense
  ```
- [ ] **Efficacité des types** (Eau > Feu, Feu > Plante, etc.)
- [ ] PV qui diminuent avec barre de progression
- [ ] Animations d'attaque
- [ ] Victoire = capture automatique ou chances augmentées

---

## 📝 Tests à effectuer

### Tests Starter
- [ ] Les 3 starters s'affichent correctement
- [ ] Click sur "Choisir" sélectionne et redirige
- [ ] Le starter est dans l'équipe
- [ ] Rechargement → redirection automatique

### Tests Rencontre
- [ ] Pokémon aléatoire Gen 1 s'affiche
- [ ] Capture réussit ~50% du temps
- [ ] Après succès, Pokémon en equipe | pokedex
- [ ] Bouton "Ajouter à l'équipe" si < 6
- [ ] Bouton "Fuir" génère nouveau Pokémon
- [ ] Compteur de tentatives s'incrémente

### Tests Banque/Équipe
- [ ] Tous les Pokémon capturés (hors équipe) visibles
- [ ] Click sur carte → Page détail
- [ ] Ajouter à l'équipe fonctionne
- [ ] Message si équipe complète (6/6)
- [ ] Retirer de l'équipe renvoie en banque
- [ ] 6 slots affichés correctement
- [ ] Réorganisation (⬆️⬇️) fonctionne

### Tests Pokédex
- [ ] 151 Pokémon Gen 1 affichés
- [ ] Silhouettes noires pour non capturés
- [ ] Ajouter à l'équipe fonctionne
- [ ] Barre de progression visuelle
- [ ] Recherche fonctionne
- [ ] Filtres (Tous/Capturés/Non capturés)
- [ ] Click sur capturé → Page détail
- [ ] Click sur non capturé → Message d'alerte

### Tests Page Détail
- [ ] Chargement via ID dans l'URL
- [ ] Toutes les infos affichées
- [ ] Stats en barres de progression
- [ ] Bouton "Ajouter à l'équipe" si en banque
- [ ] Bouton "Retirer" si en équipe
- [ ] Badge "Dans l'équipe" si applicable
- [ ] Date de capture affichée

### Tests Navigation et Guard
- [ ] Header visible sur toutes les pages /game
- [ ] Compteurs mis à jour
- [ ] Navigation entre pages fonctionne
- [ ] Bouton "Réinitialiser" reset tout
- [ ] Guard empêche accès sans starter

---

## 🎨 Améliorations suggérées

### Design
- [ ] Animations d'apparition des cartes
- [ ] Transitions entre pages
- [ ] Sons (optionnel) : cri Pokémon, capture, etc.
- [ ] Mode sombre (toggle)
- [ ] Thème de couleur par type

### Fonctionnalités
- [ ] Tri dans la banque (niveau, nom, type)
- [ ] Export/Import de sauvegarde
- [ ] Statistiques détaillées (temps de jeu, premier capturé, etc.)
- [ ] Badges de succès (10 capturés, 50 capturés, équipe type pur)
- [ ] Notes personnelles sur les Pokémon

---

## 📚 Ressources utiles

### Documentation
- **PokéBuild API** : https://pokebuildapi.fr/
- **Angular Signals** : https://angular.dev/guide/signals
- **RxJS Operators** : https://rxjs.dev/guide/operators
- **Angular Router** : https://angular.dev/guide/routing

### Outils
- **JSON Formatter** : Pour visualiser les réponses API
- **Postman** : Pour tester les endpoints
- **DevTools** : Pour déboguer les Signals

---

## 💡 Conseils de développement

### Pièges à éviter
- ❌ Ne pas muter directement les Signals (toujours `.update()` ou `.set()`)
- ❌ Ne pas oublier d'appeler les Signals avec `()` dans les templates
- ❌ Ne pas oublier le `track` dans les `@for`

---

**Que la force soit avec vous ! ⚡**
