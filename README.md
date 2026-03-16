# Yu-Gi-Oh! Deck Builder IA

App web pour générer des decks Yu-Gi-Oh! avec l'IA Claude.

## Déploiement sur Replit (5 minutes)

### 1. Créer un compte Replit
Va sur https://replit.com et crée un compte gratuit.

### 2. Créer un nouveau Repl
- Clique sur **+ Create Repl**
- Choisis **"Import from GitHub"** ou **"Node.js"**
- Si tu choisis Node.js : copie-colle manuellement les fichiers

### 3. Uploader les fichiers
Glisse ces fichiers dans ton Repl :
- `package.json`
- `server.js`
- `public/index.html`
- `.replit`

### 4. Lancer l'app
Clique sur le bouton **Run** vert. Replit installe les dépendances et démarre le serveur.
Ton app sera accessible à l'URL affichée (ex: `https://yugioh-deck-builder.tonpseudo.repl.co`)

## Utilisation
1. Ouvre l'URL de ton app
2. Entre ta clé API Anthropic (obtenue sur https://console.anthropic.com)
3. Choisis un mode : archétype, mécanique, ou collection
4. Génère ton deck !

## Structure du projet
```
yugioh-deck-builder/
├── server.js          ← Serveur Node.js (appels API)
├── package.json       ← Dépendances
├── .replit            ← Config Replit
└── public/
    └── index.html     ← Interface utilisateur
```

## API utilisées
- **Anthropic Claude** : génération intelligente des decks
- **YGOProDeck API** : informations sur les cartes, banlist
