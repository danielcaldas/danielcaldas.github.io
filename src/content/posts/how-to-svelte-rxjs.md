---
title: How to use RxJS with Svelte
description: How to use RxJS with Svelte
pubDate: 2021-07-05
tags: ['javascript', 'svelte', 'reactive-programming']
---

Svelte is an increasingly famous JavaScript framework; <a href="https://www.reddit.com/r/javascript/comments/llk8jp/review_of_svelte/" target="_blank" title="Review of Svelte : javascript">the community</a> appears to be reacting positively to the developer experience offered by Svelte. RxJS has increasingly become a standard for <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Reactive Programming</a> mainly due to Angular’s endorsement that builds its core functionalities around Observables, and the framework <a href="https://angular.io/guide/http#requesting-non-json-data" target="_blank" title="Angular">naturally interfaces with RxJS</a>.

Svelte has a reactive nature that makes it extremely suitable to integrate with RxJS. Why would anybody put the effort? **Well, simply put, you can leverage the whole RxJS ecosystem and APIs to manipulate data streams that would perfectly plug into Svelte**. Let’s look at a small example where we regularly pull data from a set of characters in a <a href="https://anapioficeandfire.com/" target="_blank" title="An API of Ice And Fire">public Game of Thrones API</a>.

```javascript
const CHARACTERS_IDS = [583, 582, 581];
let gotCharacters = of([]);
const ajaxCharacters = () =>
 CHARACTERS_IDS.map((cid) =>
   ajax({
     method: 'get',
     url: `https://anapioficeandfire.com/api/characters/${cid}`,
   })
 );
gotCharacters = interval(5000).pipe(
 tap(() => console.log('fetching characters...')),
 switchMap(() => combineLatest(...ajaxCharacters(CHARACTERS_IDS))),
 startWith([])
);
<div>
 {#each $gotCharacters as c}
   <li id="{`character-${c.id}`}">
     <ul>
       <li id="{`character-${c.id}-name`}">
         Name: {c.name}, Played by: {c.playedBy}
       </li>
     </ul>
   </li>
 {/each}
</div>
```

See how `$gotCharacters` **within the Svelte template language auto subscribed to what originally is an RxJS stream? We’re directly streaming data to the UI with no boilerplate in between whatsoever to pull values out of the stream of us!** In this small example, we see how we can have an RxJS flavored implementation within a Svelte component, leveraging the full power of RxJS operators to create and manipulate data streams.

We can say Svelte is the _“new cool kid in the block”_. It has enlarged its community over the years. <a href="https://svelte.dev/blog/svelte-3-rethinking-reactivity" target="_blank" title="Svelte 3: Rethinking reactivity">Svelte 3</a> comes with reactivity at its core, making it suitable to plugin RxJS into Svelte applications.

> “As usual, React and Vue lead the pack, but Svelte is quickly establishing itself as a very serious contender for the front-end crown.“, <a href="https://2020.stateofjs.com/en-US/technologies/front-end-frameworks/" target="_blank" title="State of JS 2020: Front-end Frameworks">State of JS 2020: Front-end Frameworks</a>

RxJS is known to be the go to library when it comes to programming with streams. Reactive programming <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">is famous for making complex things easier</a> by offering an extensive API of operators that give developers extreme power and flexibility when writing complex event-driven user interfaces.
