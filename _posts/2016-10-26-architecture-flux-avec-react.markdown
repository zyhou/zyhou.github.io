---
title: "Architecture flux avec React"
slug: "architecture-flux-avec-react"
date: 2016-10-25 16:00:00
categories: [Pattern]
tags: [Pattern, React, Flux]
---

Dans ce poste nous allons parler de l'architecture Flux de Facebook, vous pouvez retrouver un exemple sur mon Github avec une application de TodoList, [lien](https://github.com/zyhou/todolist-react).   
Pour plus d'information, [consulter la documentation](https://facebook.github.io/flux/).   

## Flux, l'explication claire  

![Schéma Flux Architecture]({{ "assets/flux-architecture.png" | prepend: site.baseurl }})

Comme on peut le voir dans l'image dessus, le flux est unidirectionnel.   

Il y a 4 principaux concepts : **View** -> **Action** -> **Dispatcher** -> **Store**    

- Les actions, qu'elles proviennent du serveur ou d'une interaction utilisateur.   
- Le dispatcher dans lequel sont envoyées les actions que ce dernier transmet à qui veut, un peu comme un EventEmitter global.    
- Les stores, qui sont l'équivalent du model de l'architecture MVC, ils contiennent les données, et réagissent aux actions que le dispatcher leur transmet.    
- Les views, qui s'occupent du rendu des données dans le DOM, et de lancer des actions lorsque l'utilisateur effectue certaines actions.   

Nous allons en détail à quoi correspond ses concepts avec du code.   

## View   

```
export default class TodoList extends Component {

  addItem() {
    TodoActions.addItem();
  }

}
```
(TodoList.js)   

Dans ce dode, quand on clique sur le boutton, il va appeler l'action addItem qui se trouve dans TodoActions.js.  

## Action     

```
class TodoActions {

    addItem() {
        AppDispatcher.dispatch({
            actionType: TodoConstants.ADD_ITEM
        });
    }

}
```
(TodoActions.js)   

Et cette action va appeler AppDispatcher.js qui diffuse l'événement.    
Dans Flux tout passe par les actions, on ne peut pas modifier l'affichage d'un composant sans action. C’est à partir d’une action qu’on pourra modifier le state d’un composant React par exemple.  

## Dispatcher  

```
const Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();
```
(AppDispatcher.js)   

On exporte simplement la class Dispatcher, qu'on va utiliser dans le Sore.
Le dispatcher est le composant unique qui reçoit toutes les actions de l’application. Son rôle est de notifier tous les stores via des callbacks que l’action a eu lieu.   

## Store  

```
AppDispatcher.register(action => {

	switch (action.actionType) {
		case TodoConstants.ADD_ITEM:
			create();
			TodoStore.emitChange();
			break;
    }

});
```
(TodoStore.js)   

On peut appeler notre méthode create(), qui va ajouter un item à la liste.   
Les stores sont les composants de Flux qui vont contenir et gérer les states de l’application. Ils fournissent au dispatcher les callbaks exécutés lors de la notification d’une action.   
Pour finir, les stores vont notifier par événement les changements d’état aux vues leur correspondant.   

## Ce qu'il faut retenir   

Lorsque qu'un ou plusieurs stores composent l'état d'un state React, alors à chaque changement de l'un de ces stores, tous les composants React concernés et leurs enfants vont appeler leur méthode render().    
Afin d'éviter des appels superflus à ces méthodes, React donne la possibilité de tester soi-même s'il est nécessaire de mettre à jour le component en déclarant une méthode shouldComponentUpdate retournant un boolean qui stipulera si oui ou non il est nécessaire d'appeler render().    

- Flux, c'est comme du MVC en plus simple, et avec moins de bugs   
- L'architecture est unidirectionnelle   
- On raisonne en actions, qui sont déclenchées par la vue ou le serveur   
- Toutes les actions passent par le dispatcher   
- Seuls les stores signalent aux vues qu'il faut se mettre à jour   

Vous pouvez retrouver une explication sous forme de BD sur [https://code-cartoons.com/](ttps://code-cartoons.com/)   

## Aller plus loin 

Suite à la parution de Flux, un autre pattern dérivé a fait son apparition et semble remporter tous les suffrages en termes de popularité : Redux.   

Nous n’allons pas le présenter en détails ici, mais étant le résultat d’une réflexion à partir de différentes solutions, dont Flux, il me semble intéressant de l’évoquer.   
Globalement, l’idée est de fiabiliser le contrôle de l’évolution des states d’une application front, notamment les single page applications. Redux repose sur 3 principes :   

- Single source of truth : Le state est représenté sous forme de grappes d’objets   
- On ne modifie JAMAIS un state: on créera toujours une copie de l’objet à modifier   
- Les données sont traitées à l’aide de fonctions pures   

Par rapport à flux, le dispatcher disparait et il n’y a plus qu’un seul store en interaction directe avec les reducers. Ce sont eux (les reducers) les fonctions pures du 3ème principe. Ces principes sont décrits dans le détail dans la documentation officielle.

Source :

[https://code-cartoons.com/](ttps://code-cartoons.com/)   
[http://facebook.github.io/flux/](http://facebook.github.io/flux/)   
[http://blog.soat.fr/2016/04/larchitecture-flux-avec-react/](http://blog.soat.fr/2016/04/larchitecture-flux-avec-react/)   
[http://redux.js.org/docs/introduction/ThreePrinciples.html](http://redux.js.org/docs/introduction/ThreePrinciples.html)   