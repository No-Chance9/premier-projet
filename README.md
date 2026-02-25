# Ziema

Projet personnel (premier projet en **Next.js**) autour d'un futur outil de **gestion de ventes / stock** pour e-commerce.

L'objectif est de centraliser des données (ventes, clients, produits, statistiques) dans un dashboard, puis à terme de connecter l'application aux **APIs de marketplaces** pour automatiser la récupération des informations.

## Présentation

Ce projet m'a permis d'expérimenter une base **full-stack** avec :

- **Next.js (App Router)** et **React**
- **Authentification** (NextAuth avec credentials + session JWT)
- **MongoDB / Mongoose** pour la gestion des utilisateurs et données du dashboard
- **API Routes** côté backend
- **Dashboard avec graphiques** (Chart.js / react-chartjs-2)

Certaines valeurs sont encore **mockées / en dur** pour illustrer les graphiques et les écrans. Le but final est de remplacer ces données par des flux réels issus des marketplaces.

## Fonctionnalités déjà en place

- Inscription utilisateur avec validations (mot de passe, email, etc.)
- Connexion / déconnexion avec NextAuth
- Gestion des utilisateurs en base MongoDB
- Création automatique d'un dashboard utilisateur à l'inscription
- Middleware de protection des routes (avec gestion de rôle `User` / `Admin`)
- Dashboard avec indicateurs et graphiques (croissance clients, visiteurs annuels, best-selling)
- Ajout / suppression de données sur certains graphiques (persistées en base)
- Export CSV des données du dashboard
- Profil utilisateur avec upload et liaison d'image de profil
- Flux "mot de passe oublié" / réinitialisation (email via Mailtrap en dev)

## Vision / Roadmap

- Connexion aux APIs de marketplaces (Amazon, Shopify, etc.)
- Synchronisation automatique des ventes / stocks
- Consolidation multi-plateformes dans un seul dashboard

## Stack technique

- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS
- **Auth** : NextAuth (Credentials Provider, JWT)
- **Base de données** : MongoDB + Mongoose
- **Charts / UI** : Chart.js, react-chartjs-2, Headless UI, Heroicons, MUI (tests / expérimentation)
- **Email** : Nodemailer (Mailtrap en développement)
- **Upload** : stockage local dans `public/` + métadonnées en MongoDB

## Lancer le projet en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le fichier d'environnement

Créer un fichier `.env.local` à la racine avec au minimum :

```env
MONGODB_URI=mongodb://localhost:27017/ziema
NEXTAUTH_SECRET=un_secret_long_et_aleatoire
NEXTAUTH_URL=http://localhost:3000
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Scripts utiles

- `npm run dev` : démarre l'application en développement
- `npm run build` : build de production
- `npm run start` : lance le build en production
- `npm run lint` : lint du projet

## Structure (aperçu)

- `app/` : pages Next.js, composants UI, routes API (App Router)
- `models/` : schémas Mongoose (User, Dashboard, Notification, etc.)
- `lib/` : auth, connexion MongoDB, utilitaires
- `actions/` : server actions (ex: inscription)
- `public/` : assets statiques, images, uploads de profils

## Statut du projet

Projet **en cours / prototype fonctionnel**.

Il s'agit d'un projet d'apprentissage important dans mon parcours, utilisé pour pratiquer la conception d'une application full-stack en Next.js avant un déploiement futur dans mon portfolio.
