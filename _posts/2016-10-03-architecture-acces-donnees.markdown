---
title: "Architecture d'acces aux données"
slug: "architecture-acces-aux-donnees"
date: 2016-10-03 19:00:00
categories: [Pattern]
tags: [Pattern, .NET Core]
---

# Exemple d'architecture d'accès aux données.

Le but est d'isoler la couche d'accès aux données de toutes dépendances, de pouvoir réutiliser le projet dans d'autres solutions.

On peut très facilement appeler le projet AccessData dans d'autres produits (un site web, une application mobile, etc...).   
AccessData est juste lié à IAccessDATA, on a juste des interfaces. Ce qui permet de définir des contracts pour les modèles qui vont appeler les méthodes d'accès aux données.   
Le contexte est injecté aux plus haut niveaux de l'application, ce qu'il fait que l'on peut changer de SGDB à tout moment. 

**Ce qui est vraiment intéressant dans cette architecture, ce sont les critères de filtrage et la création de modèles.**

## Les fichiers.

On retrouve 4 fichiers qui vont gérer une table de notre base de données, petite explication sur leur utilité :

**Repository :** Permet de mettre à jour les informations de la table.   
**Datasource :** Permet la récupération des informations simples ou des modèles.   
**ModelBuilder :** Seulement appelé par le Datasource, il va construire les modèles (remplir les interfaces exactement).   
**QueryBuilder :** Va filtrer en fonction des critères qu'on aura choisi les informations à récupérer.

En fonction de la taille de votre application, on peut mettre dans un même fichier le Repository et le Datasource.

![Schéma base architecture]({{ "assets/archi-accessdata-base.png" | prepend: site.baseurl }})

## Le filtrage.

Comme vu précédement, c'est le QueryBuilder qui joue ce rôle.  
Dans notre exemple nous avons peu de colonnes et de filtres, mais imaginons une table avec 50-100 colonnes, un écran qui propose une zone de filtre et un tableau qui affiche les résultats filtrés dessous.

Nous allons créer une classe de critères (voir exemple "Récupération de tout les blogs non clos"), qui sera passé en paramétre du Datasource qui lui appellera la méthode FeedQuery du QueryBuilder.   

Cela répond au besoin que nous avons, un écran complexe avec une quantité de filtres qui renvoit un modèle bien précis.

L'autre avantage c'est la réutilisation des filtres.    
Par exemple, nous avons une application mobile et un site web qui liste des postes d'un blog, il suffit que tous les deux implémentent l'interface de critères, ainsi ils utiliseront les mêmes filtres.   
Nous n'avons pas de duplication de récupération de données. 

## Voir plus loin.

Le code source du projet est un exemple minime, concevons une base de données avec 500 tables qui gèrent plusieurs éléments. (un blog / des utilisateurs / sytemes de ventes / etc...)      
Au lieu d'avoir un simple projet AccessData (qui serait énorme 500 tables * 4 fichiers, ca fait du monde), on peut regrouper les différentes thèmes dans des projets différents.   

Avoir un BlogAccessData / UserAccessData / VenteAccessData ou juste un projet AcessData qui contiendraient les Migrations et les Entities. (Chaque projet XXXAccessData doit avoir son IXXXAccessData)   
Chaque XXXAccessData contient ses propres dossiers pour plus de clarté avec chacun les 4 fichiers. On aurait un dossier par table.

**Comment je peux créer une commande et une ligne de commande en même temps ?**

Chaque dossier ne peut accéder qu'à la table qu'il représente. Dans CommandeRepository (qui va créer notre commande), je ne peux pas avoir de contexte.LigneCommande.Add(new LigneCommande()) par exemple.   

**Comment répondre à cette problèmatique ?**   

Au niveau de notre Program.cs (ou controller pour un projet web), on pourrait faire appel à CommandeRepository et enchainer avec LigneCommandeRepository sauf que dans notre aplication mobile on devrait faire de même.   
Le code n'est pas très centralisé, on peut refactorer ça dans une méthode simple qui serait appelé par nos applications.

Il faut créer un projet par exemple, BusinessAccessData (et aussi un projet IBusinessAccessData) qui pourra gérer le tout. Il fera référence à tous nos XXXAccessData et IXXXAccessData.   
Ce sera ce projet qui permettra d'appeler nos différents Repository à la suite des uns des autres. Il pourra également faire appel à plusieurs datasource si on a un modèle complexe.

Et maintenant dans notre Program.cs (controller), on peut appeler directement BuisnessAccessData.   

![Schéma complet architecture]({{ "assets/archi-accessdata-complet.png" | prepend: site.baseurl }})

Architecture mis en place avec Steeve dans la boite actuelle. Répond au besoin suite à de nombreux écran de filtrage dans l'application web. 