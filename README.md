#  Avocat-Link — Plateforme Juridique Algérienne

##  Trinôme

| Nom     | Prénom |
|-----    |--------|
| CHERGUI | Serine |
| LAIB    | Alaa   |
| SLIMANI | Sabrina|

> Projet de Fin de Module "Build & Ship" — Architecture Cloud & Vibe Programming

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://avocat-link.vercel.app)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org)

---

##  Mapping du Thème

| Entité                    | Table Supabase                | Description |
|---------------------------|-------------------------------|-------------|
|**Table A** — Utilisateurs | `profiles` (via `auth.users`) | Les **clients** qui cherchent un avocat |
|**Table B** — Ressources   | `avocats`                     | Les **avocats** inscrits sur la plateforme |
|**Table C** — Interactions | `consultations`               | Les **demandes de consultation** reliant clients et avocats |
|**Fichier (Storage)** | Bucket `dossiers` | Le **dossier de preuve en PDF** joint à chaque consultation |

---

##  Flux Utilisateur

```
Inscription/Connexion → Parcourir les Avocats → Demander une Consultation + Upload PDF → Tableau de bord
```

---

##  Stack Technique

- **Frontend** : Next.js 16 (App Router, React 19, TypeScript)
- **Backend/BaaS** : Supabase (Authentication, PostgreSQL, Storage, RLS)
- **Hébergement** : Vercel (CI/CD avec intégration GitHub automatique)
- **Styles** :  CSS Modules + Variables CSS natives (Glassmorphism, sans TailwindCSS)

---

##  Analyse d'Architecture (Rapport Architecte)

### 1. Pourquoi Vercel + Supabase est plus logique financièrement qu'un serveur classique ? (CAPEX vs OPEX)

Un serveur classique implique des coûts en **CAPEX** (Capital Expenditure) : achat de machines physiques, de racks, de licences logicielles, et d'infrastructure réseau — des dépenses importantes payées en une seule fois, avant même de lancer le projet. À cela s'ajoutent des coûts fixes en **OPEX** (Operating Expenditure) : électricité, climatisation, maintenance, salaires des administrateurs système.

Avec **Vercel + Supabase**, tout devient de l'**OPEX variable** : on paie uniquement ce qu'on consomme. Le tier gratuit de Supabase couvre 50 000 utilisateurs actifs et 500 Mo de stockage, et Vercel offre un hébergement gratuit pour les projets personnels avec CI/CD inclus. Pour un projet de fin de module ou une startup en phase de lancement, c'est une réduction drastique du risque financier : **zéro investissement initial**, et montée en charge possible selon la croissance réelle de l'application.

### 2. Comment Vercel gère-t-il la scalabilité comparé à un Data Center physique local ?

Un **Data Center physique** algérien nécessite une infrastructure lourde : des serveurs rack, de la climatisation industrielle (la chaleur étant un ennemi des serveurs), des groupes électrogènes, et une équipe dédiée. Si l'application connaît un pic de trafic (ex: couverture médiatique), les serveurs peuvent saturer et tomber en panne — car la capacité est fixe et non élastique.

**Vercel** repose sur un réseau mondial de fonctions **Serverless** et d'un **CDN Edge** (Content Delivery Network). Chaque requête est traitée par la fonction la plus proche géographiquement de l'utilisateur. En cas de pic de trafic, Vercel scale **automatiquement** en quelques millisecondes, sans intervention humaine, sans serveur supplémentaire à acheter. La disponibilité est garantie par une architecture distribuée sur plusieurs zones géographiques — impossible à reproduire avec un seul serveur local.

### 3. Données Structurées vs Données Non-structurées dans Avocat-Link

| Type                        | Exemples dans Avocat-Link |
|-----------------------------|---------------------------|
| **Données Structurées**     | Tables PostgreSQL (`profiles`, `avocats`, `consultations`) avec schéma fixe : colonnes typées, clés primaires/étrangères, contraintes SQL. Requêtes via API Supabase. |
| **Données Non-structurées** | Les **dossiers de preuve en PDF** uploadés par les clients dans le bucket Supabase Storage. Ces fichiers n'ont pas de format interne standardisé, peuvent varier en taille et contenu, et sont stockés comme des objets binaires référencés par URL. |

---

##  Installation locale

```bash
git clone https://github.com/alaib-hub/avocat-link.git
cd avocat-link
npm install
cp .env.local.example .env.local
npm run dev
```

---
## Fonctionnalités

- Inscription / Connexion (Clients)
- Recherche d’avocats par spécialité et wilaya
- Prise de rendez-vous (consultations)
- Upload de documents juridiques (PDF)
- Tableau de bord utilisateur 


##  Schéma SQL Supabase

Voir `supabase/schema.sql` pour le script complet de création des tables et des règles RLS.

---

## Compte de test
Un compte de démonstration sera crée et enovoyé dans le PDF.
---



**Thème choisi** : Juridique — **Avocat-Link**  
(A) Clients · (B) Avocats · (C) Consultations · Fichier = Dossier de preuve PDF
