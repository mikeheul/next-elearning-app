import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const coursesData = [
  {
    title: 'Introduction à la Programmation',
    description: 'Apprenez les bases de la programmation avec des exemples pratiques et des exercices.',
    userId: 'user1', // Remplacez par un ID d'utilisateur valide
    lessons: [
      {
        title: 'Qu’est-ce que la programmation?',
        content: `
# Qu’est-ce que la programmation?

La programmation est le processus de création d'instructions que les ordinateurs peuvent comprendre et exécuter. C'est un domaine en constante évolution, qui permet de résoudre des problèmes variés grâce à des algorithmes et à la manipulation de données.

## Concepts clés

- **Algorithme**: Une série d'étapes pour résoudre un problème.
- **Langage de programmation**: Un langage utilisé pour écrire des algorithmes.

### Pourquoi apprendre la programmation?

1. **Développement de compétences**: Amélioration des capacités de résolution de problèmes.
2. **Opportunités de carrière**: Forte demande pour les développeurs dans divers secteurs.

### Exemples de langages de programmation

| Langage      | Utilisation              | Difficulté |
|--------------|--------------------------|------------|
| Python       | Analyse de données       | Facile     |
| JavaScript   | Développement web        | Modéré     |
| C++          | Développement système     | Difficile  |

Voici un exemple simple de code en Python :

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))
\`\`\`
        `,
      },
      {
        title: 'Les Langages de Programmation',
        content: `
## Les Langages de Programmation

### Introduction

Il existe de nombreux langages de programmation, chacun ayant ses propres caractéristiques et usages.

### Langages populaires

- **Python**: Utilisé pour l'analyse de données et le développement web.
- **JavaScript**: Essentiel pour le développement de sites web interactifs.
- **Java**: Utilisé dans le développement d'applications d'entreprise.

### Caractéristiques des langages

| Langage      | Typage        | Paradigme         |
|--------------|---------------|-------------------|
| Python       | Dynamique     | Objet, Fonctionnel |
| JavaScript   | Dynamique     | Objet              |
| Java         | Statique      | Objet              |

### Exemples de syntaxe

#### Python

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

#### JavaScript

\`\`\`javascript
let fruits = ["apple", "banana", "cherry"];
fruits.forEach(fruit => {
    console.log(fruit);
});
\`\`\`
        `,
      },
      {
        title: 'Les Concepts de Base',
        content: `
# Les Concepts de Base en Programmation

## Variables

Les variables sont des espaces de stockage pour les données. Elles peuvent contenir différents types de données.

### Types de données

- **Nombres**
- **Chaînes de caractères**
- **Booléens**

### Exemples de déclaration de variables

| Langage      | Exemple                       |
|--------------|-------------------------------|
| Python       | \`x = 5\`                     |
| JavaScript   | \`let x = 5;\`                |
| Java         | \`int x = 5;\`                |

## Contrôles de Flux

Les contrôles de flux permettent de gérer le chemin d'exécution d'un programme.

### Conditionnelles

\`\`\`python
if x > 10:
    print("Plus grand que 10")
else:
    print("10 ou moins")
\`\`\`
        `,
      },
    ],
  },
  {
    title: 'Développement Web',
    description: 'Une introduction au développement web, de HTML à CSS et JavaScript.',
    userId: 'user1', // Remplacez par un ID d'utilisateur valide
    lessons: [
      {
        title: 'HTML de base',
        content: `
# HTML de base

HTML (HyperText Markup Language) est le langage standard pour créer des pages web. Il structure le contenu sur le web.

## Structure d'un Document HTML

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Ma Page</title>
</head>
<body>
    <h1>Bienvenue sur ma page!</h1>
</body>
</html>
\`\`\`

### Éléments HTML

- **Titres**: \`<h1>\`, \`<h2>\`, etc.
- **Paragraphes**: \`<p>\`
- **Liens**: \`<a href="url">Texte du lien</a>\`

### Exemple de tableau

| Élément      | Description                       |
|--------------|-----------------------------------|
| \`<h1>\`     | Titre principal                    |
| \`<p>\`      | Un paragraphe de texte             |
| \`<a>\`      | Crée un lien vers une autre page  |
        `,
      },
      {
        title: 'CSS et le Style',
        content: `
## CSS et le Style

CSS (Cascading Style Sheets) est utilisé pour styliser les pages HTML. Voici comment l'utiliser :

### Syntaxe de base

\`\`\`css
body {
    background-color: lightblue;
}
h1 {
    color: white;
}
\`\`\`

### Sélecteurs CSS

- **Sélecteur de type**: \`h1\`
- **Sélecteur de classe**: \`.maClasse\`
- **Sélecteur d'identifiant**: \`#monId\`

### Exemple de tableau CSS

| Propriété         | Description                           |
|-------------------|---------------------------------------|
| \`color\`         | Définit la couleur du texte           |
| \`background\`    | Définit la couleur d'arrière-plan     |
| \`font-size\`     | Définit la taille de la police        |

### Exemple de code CSS

\`\`\`css
.button {
    padding: 10px;
    background-color: blue;
    color: white;
}
\`\`\`
        `,
      },
      {
        title: 'JavaScript pour les Développeurs Web',
        content: `
# JavaScript pour les Développeurs Web

JavaScript est un langage de programmation utilisé pour rendre les pages web interactives.

## Caractéristiques principales

- **Dynamique**: Permet de modifier le contenu d'une page à la volée.
- **Orienté objet**: Permet la création d'objets.

### Événements en JavaScript

Les événements sont des actions qui se produisent dans le navigateur.

\`\`\`javascript
document.getElementById("myButton").addEventListener("click", function() {
    alert("Button clicked!");
});
\`\`\`

### Exemples de tableaux

| Événement      | Description                        |
|----------------|------------------------------------|
| \`click\`      | L'utilisateur clique sur un élément |
| \`load\`       | La page est complètement chargée   |
| \`keydown\`    | Une touche du clavier est enfoncée |

### Portion de code exemple

\`\`\`javascript
function add(a, b) {
    return a + b;
}
console.log(add(5, 3)); // Affiche 8
\`\`\`
        `,
      },
    ],
  },
  {
    title: 'Bases de Données',
    description: 'Comprendre les bases de données et comment interagir avec elles.',
    userId: 'user1', // Remplacez par un ID d'utilisateur valide
    lessons: [
      {
        title: 'Introduction aux Bases de Données',
        content: `
# Introduction aux Bases de Données

Une base de données est un système organisé de données. Elle permet de stocker, de manipuler et de récupérer des informations.

## Types de Bases de Données

1. **Bases de données relationnelles**: Utilisent des tables pour organiser les données.
2. **Bases de données non relationnelles**: Utilisent des formats comme JSON pour stocker les données.

### Avantages des Bases de Données

| Avantage                    | Description                               |
|-----------------------------|-------------------------------------------|
| **Intégrité des données**   | Garantit que les données sont correctes  |
| **Efficacité**             | Permet des requêtes rapides               |
| **Sécurité**               | Protège les données contre les accès non autorisés |

### SQL vs NoSQL

\`\`\`sql
SELECT * FROM utilisateurs WHERE age > 18;
\`\`\`
        `,
      },
      {
        title: 'SQL : Langage de Requête',
        content: `
## SQL : Langage de Requête

SQL (Structured Query Language) est le langage utilisé pour interagir avec les bases de données relationnelles.

### Commandes SQL de base

- **SELECT**: Récupérer des données.
- **INSERT**: Ajouter des données.
- **UPDATE**: Modifier des données.

### Exemples de commandes SQL

\`\`\`sql
-- Récupérer tous les utilisateurs
SELECT * FROM utilisateurs;

-- Ajouter un nouvel utilisateur
INSERT INTO utilisateurs (nom, age) VALUES ('Alice', 30);
\`\`\`

### Création de Tables

\`\`\`sql
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY,
    nom VARCHAR(100),
    age INT
);
\`\`\`
        `,
      },
      {
        title: 'NoSQL et Bases de Données Alternatives',
        content: `
# NoSQL et Bases de Données Alternatives

Les bases de données NoSQL offrent une alternative aux bases de données relationnelles traditionnelles.

## Types de bases NoSQL

- **Documentaire**: Stocke des données sous forme de documents (ex: MongoDB).
- **Colonne**: Organise les données en colonnes (ex: Cassandra).
- **Clé-Valeur**: Stocke les données sous forme de paires clé-valeur (ex: Redis).

### Avantages des bases NoSQL

| Avantage                    | Description                                |
|-----------------------------|--------------------------------------------|
| **Scalabilité**             | Peut être facilement étendu                |
| **Flexibilité**             | Structure de données dynamique              |
| **Performance**             | Optimisé pour des lectures et écritures rapides |

### Exemples de commandes MongoDB

\`\`\`javascript
db.users.insert({ name: "Bob", age: 25 });
db.users.find({ age: { $gt: 18 } });
\`\`\`
        `,
      },
    ],
  },
];

// Fonction pour ajouter les cours et les leçons à la base de données
async function addCourses() {
  for (const course of coursesData) {
    // Créez le cours et les leçons associées
    const createdCourse = await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        userId: course.userId, // Assurez-vous que cet ID utilisateur existe
        lessons: {
          create: course.lessons.map(lesson => ({
            title: lesson.title,
            content: lesson.content,
          })),
        },
      },
    });
    console.log('Cours ajouté:', createdCourse);
  }
}

// Appelez la fonction pour insérer les données
addCourses()
  .then(() => console.log('Tous les cours ont été ajoutés avec succès'))
  .catch((error) => console.error('Erreur lors de l\'ajout des cours:', error));
