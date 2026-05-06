# 🎫 EventManager - Plateforme de Gestion d'Événements

EventManager est une application web moderne développée avec **Angular 19**, conçue pour simplifier l'organisation d'événements, la gestion des artistes, des partenaires et la billetterie sécurisée.

![Status](https://img.shields.io/badge/Status-Completed-success)
![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3?logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Caractéristiques principales

- **Tableau de Bord Dynamique** : Vue d'ensemble en temps réel des statistiques (événements, tickets, utilisateurs).
- **Gestion Complète (CRUD)** :
  - 📅 **Événements** : Planification, gestion de la capacité et suivi du remplissage.
  - 🎤 **Artistes** : Gestion du répertoire et programmation artistique.
  - 👥 **Utilisateurs** : Base de données clients et accès administratif.
  - 🏢 **Organisateurs** : Réseau de partenaires et sponsors.
- **Système de Billetterie** : Émission de tickets, gestion des tarifs par catégorie et validation.
- **Interface Premium** : Design moderne "Glassmorphism" avec navigation fluide et responsive.

## 🚀 Technologies utilisées

- **Frontend** : [Angular 19](https://angular.io/) (Components Standalone, Signals, Router)
- **Styling** : [Bootstrap 5.3](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Architecture** : Clean Code, Services API, Modèles de données typés TypeScript.
- **Design Pattern** : Modern SaaS UI (Shadows, Rounded Corners, Backdrop filters).

## 🛠️ Installation et Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [Angular CLI](https://angular.io/cli)

### Installation
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/Junior2401/api_events_manager.git
   cd api_events_manager
   ```

   ```bash
   ou
   git clone https://gitlab2.istic.univ-rennes1.fr/alali/tp_angular.git
   cd tp_angular
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le serveur de développement en invite de commandes :
   ```bash
   ng serve
   ```
   L'application sera accessible sur `http://localhost:4200/`.

## 🎨 Modernisation de l'Interface (Rendu Final)

Le projet a subi une refonte esthétique majeure proposée par gémini pour offrir une expérience utilisateur haut de gamme :
- **Navigation** : Sidebar Slate 800 avec menu actif lumineux et Navbar à effet de flou.
- **Composants** : Utilisation systématique de cartes (`Cards`) sans bordures avec ombres portées douces.
- **Formulaires** : Champs enrichis d'icônes contextuelles et validation visuelle temps réel.
- **UX** : Transitions animées sur les boutons et indicateurs de chargement stylisés.

## 📁 Structure du Projet

```text
src/app/
├── components/          # Composants par module (Artistes, Events, Tickets...)
│   ├── dashboard/       # Tableau de bord principal
│   ├── evenements/      # Gestion du catalogue
│   └── ...
├── models/              # Interfaces et types TypeScript
├── services/            # Logique de communication API
└── app.routes.ts        # Configuration du routage
```

### Développeurs :
- **Alissou ALI**
-  **Andy BONGO**

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---
© 2026 **EventManager Team** - Développé par amour ❤️ pour l'excellence événementielle.
