---
title: 'Reactive Series (pt. 4) - Reactive Programming: The Good and the Bad'
description: 'Reactive Series - Part 4'
pubDate: 2020-12-03
tags: ['javascript', 'reactive-programming']
---

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- **Part 4 - Reactive Programming: The Good and the Bad**
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="\_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>

<br>

After seeing reactive streams in action with RxJS, I would now like to expand <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">"Part 1 - Why you should consider Reactive Programming"</a> by debating some of the gains & pains of reactive streams and RxJS.
As of now, we've covered some fundamental aspects of reactive programming, and we've seen some code as well!
In this part of the series, I'll be compacting some of the benefits I felt while using reactive programming and some of the major pain points of adopting it. Since we've used RxJS, I'll make occasional mentions of this reactive library's ups and downs.

- [The good](#the-good)
  - [Your code becomes inheritably lazy](#your-code-becomes-inheritably-lazy)
  - [Your code is likely to be more concise](#your-code-is-likely-to-be-more-concise)
  - [You're likely to write less code](#youre-likely-to-write-less-code)
  - [Effortless cancellation](#effortless-cancellation)
  - [Easier to deal with backpressure](#easier-to-deal-with-backpressure)
  - [Converging towards a single style of coding](#converging-towards-a-single-style-of-coding)
  - [Complicated things made easy](#complicated-things-made-easy)
  - [Maintainability](#maintainability)
- [The bad](#the-bad)
  - [Learning curve](#learning-curve)
  - [Debugging does not get any easier](#debugging-does-not-get-any-easier)
  - [Human creativity](#human-creativity)
  - [With great power](#with-great-power)
  - [Error handling](#error-handling)
- [Closing notes](#closing-notes)

#### The good

Let's explore some beneficial aspects of adopting reactive programming and RxJS now that we have looked at <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">how to approach a problem and model it with streams</a>.

##### Your code becomes inheritably lazy

Working with streams means nothing happens until you subscribe to them, which is terrific! Because any code path now has a "free of charge" stop & play capability! Without any effort, your computations become lazy by default executing when needed - <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" title="Promise - JavaScript | MDN">Promises</a> are eager. They start running as soon as you construct them. It's common to wrap a Promise with a function to make it lazy.

##### Your code is likely to be more concise

As we've seen in the <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">hands-on</a> part of this series, you'll likely have to model events and think about what parties are interested in consuming such events. You'll spend less time focusing on the implementation details. You'll rather spend your time drawing a mental map of the events' interdependency that define your business logic. In my experience, this often results in more compact implementations, making it more accessible to capture the big picture of the internal flows in your application.

##### You're likely to write less code

It only makes sense that if you have an ecosystem, such as RxJS, in your arsenal, you'll spend less time implementing behaviors that are already built-in in some operator (e.g., <a href="https://www.learnrxjs.io/learn-rxjs/operators/filtering/debounce" target="_blank" title="debounce - Learn RxJS">debouncing</a>, <a href="https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttle" target="_blank" title="throttle - Learn RxJS">throttling</a>, etc.). Just like you'll spend less time mutating the DOM directly when you use a UI framework such as React or Vue, you'll think more about how your UI looks like and what data binds to what parts of your UI.

##### Effortless cancellation

In my opinion, an overlooked easy win of coding with streams and RxJS is how easy it becomes to implement cancellation. What kind of behavior does cancellation concern, you ask? Let's see an example.

!['cancellation of http request on hover items in a list'](./assets/reactive-rxjs-pros-cons/rxjs-free-cancellation.gif 'rxjs free cancellation')

In the above GIF, we have a list of items. Hovering on each item in the list triggers an ajax request to fetch some data from the server. The problem of eagerly (compared with clicking the item, for instance) triggering the requests upon mouse hovering is that you can potentially fetch the data for all the items but ending up not displaying any of the data to the end-user. To avoid that, we cancel an item's request when the user's mouse leaves it.

<small>(<b>Note</b>: oh, btw on the above GIF, I'm not calling a real API, I'm just using the <a href="https://tweak-extension.com" target="_blank" title="tweak browser extension mock API simulator">tweak browser extension</a> to mock the HTTP requests seamlessly)</small>

<br />

Here's the snippet of the above pattern, implemented with <a href="https://rxjs-dev.firebaseapp.com/api/operators/switchMap" target="_blank" title="RxJS - switchMap">switchMap</a> and <a href="https://rxjs-dev.firebaseapp.com/api/operators/takeUntil" target="_blank" title="RxJS - takeUntil">takeUntil</a>.

```javascript
const listEl = document.getElementById('list')
const resEl = document.getElementById('res')
const fetchById = (id) => ajax(`https://some-service.com/api/items/${id}`).pipe(map((r) => r.response))
const mouseOutItem$ = fromEvent(listEl, 'mouseout')
const mouseOverItem$ = fromEvent(listEl, 'mouseover')
  .pipe(
    switchMap((event) => {
      const id = event.target.id
      resEl.innerHTML = `loading item ${id}...`
      console.log(`Fetching data for item ${id}...`)
      return fetchById(id)
    }),
    map((response) => {
      resEl.innerHTML = JSON.stringify(response, null, 2)
      console.log(`Done fetching data for item ${response.item.id}!`)
    }),
    takeUntil(
      mouseOutItem$.pipe(
        tap(() => {
          console.log(`❌ Cancelled fetch data for item ${event.target.id}!`)
          resEl.innerHTML = '...'
        }),
      ),
    ),
    repeat(),
  )
  .subscribe()
```

<br />

<Accordion summary='Expand to see example full code'>

```html
<!doctype html>

<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.5.5/rxjs.umd.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.5.5/rxjs.umd.js.map"></script>
  <style>
    li {
      padding: 4px;
      border: 1px dashed green;
      color: black;
    }

    li:hover {
      background-color: lightblue;
      color: blueviolet;
      cursor: pointer;
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div id="app"></div>
  <script>
    const { delay, filter, map, mapTo, switchMap, takeUntil, takeWhile, tap, withLatestFrom, repeat } =
      window.rxjs.operators
    const { fromEvent, merge, timer } = window.rxjs
    const ajax = window.rxjs.ajax.ajax

    // preventing the default event on dragover
    // so that we're allowed to drop an element
    fromEvent(document, 'dragover')
      .pipe(tap((event) => event.preventDefault()))
      .subscribe()

    // all the game markup goes here
    document.getElementById('app').innerHTML = `
      <h2>Hover on the items to fetch some async data</h2>
      <ul id="list">
        <li id="item-1">item 1 (mouse over to fetch data)</li>
        <li id="item-2">item 2 (mouse over to fetch data)</li>
        <li id="item-3">item 3 (mouse over to fetch data)</li>
        <li id="item-4">item 4 (mouse over to fetch data)</li>
      </ul>
      <h3>Item detail</h3>
      <pre id="res">...</pre>
    `

    const listEl = document.getElementById('list')
    const resEl = document.getElementById('res')
    const fetchById = (id) => ajax(`https://some-service.com/api/items/${id}`).pipe(map((r) => r.response))
    const mouseOutItem$ = fromEvent(listEl, 'mouseout')
    const mouseOverItem$ = fromEvent(listEl, 'mouseover')
      .pipe(
        switchMap((event) => {
          const id = event.target.id
          resEl.innerHTML = `loading item ${id}...`
          console.log(`Fetching data for item ${id}...`)
          return fetchById(id)
        }),
        map((response) => {
          resEl.innerHTML = JSON.stringify(response, null, 2)
          console.log(`Done fetching data for item ${response.item.id}!`)
        }),
        takeUntil(
          mouseOutItem$.pipe(
            tap(() => {
              console.log(`❌ Cancelled fetch data for item ${event.target.id}!`)
              resEl.innerHTML = '...'
            }),
          ),
        ),
        repeat(),
      )
      .subscribe()
  </script>
</body>
```

</Accordion>

<br />
<br />

##### Easier to deal with backpressure

> "Backpressure is when the progress of turning that input to output is resisted in some way. In most cases that resistance is computational speed", from <a href="https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7" target="_blank" title="Backpressure explained — the resisted flow of data through software | by Jay Phelps | Medium">"Backpressure explained — the resisted flow of data through software"</a>

Did it ever happen that your `addEventListener` handle is just executing too many times? For instance, while running an event handler for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event" target="_blank" title="Document: scroll event - Web APIs | MDN">scroll event</a>? It's common to use a debounce strategy to run your event handler only after X time has passed since the last scroll event. Again, with built-in operators such as debounce in RxJS, you can quickly relieve the load in your consumer functions (event handlers). The operator single-handedly takes care of debouncing emissions for you!

##### Converging towards a single style of coding

I've covered this in greater detail during <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">"Part 1 - Why you should consider Reactive Programming"</a> the gist is that working with streams when done right, might make callbacks, Promises, and async/await nearly obsolete. I say nearly because you' might still use Promises under the hood, but your code now can look the same whether you're tackling synchronous or asynchronous tasks.

##### Complicated things made easy

I want to reinforce that you can leverage reactive libraries such as RxJS to solve complex problems with little effort. If you haven't watched the talk <a href="https://www.youtube.com/watch?v=B-nFj2o03i8" target="_blank" title="Complex features made easy with RxJS - YouTube">"Complex features made easy with RxJS"</a> by <a href="https://twitter.com/BenLesh" target="_blank" title="Ben Lesh (@BenLesh) / Twitter">Ben Lesh</a>, I would highly recommend it. In the first 10 minutes, you'll see how easy it becomes to tackle some of the following problems with the help of RxJS:

- Basic drag & drop implementation <a href="https://youtu.be/B-nFj2o03i8?t=351" target="_blank" title="Complex features made easy with RxJS - YouTube">[5:54]</a>
- Avoid double submission through a button that involves an asynchronous Ajax call <a href="https://youtu.be/B-nFj2o03i8?t=424" target="_blank" title="Complex features made easy with RxJS - YouTube">[7:04]</a>
- Throttle autosuggestion field that involves fetching data with a given search term <a href="https://youtu.be/B-nFj2o03i8?t=444" target="_blank" title="Complex features made easy with RxJS - YouTube">[7:24]</a>

If you aim to solve one of the problems mentioned in the above list, you can avoid reinventing the wheel by following the reactive patterns demonstrated in the video.

##### Maintainability

There are two aspects of maintainability that I would point out. First, you'll write less code; there's a lot of heavy lifting that RxJS can do for you; if you leverage that, you'll undoubtedly ending writing less code. The second is that a combination of streams with powerful operators solve complex problems in a very declarative manner. Code will look concise and straightforward; instead of verbose branching and imperative logic, you'll have a few combinations of operators that will do all the magic for you.
However, with RxJS and streams, maintainability is a double-edged sword. We're going to cover that in the next part of this article.

#### The bad

Let's look at the not so bright side.

##### Learning curve

Any modern JavaScript codebase uses a cocktail of libraries. RxJS (or whatever library you would adopt) would be just one more thing you'll have to teach newcomers. But don't take this as a light decision. You're not only introducing a new library in the codebase, but you're also introducing a new paradigm. I feel there's quite a learning curve towards mastering reactive programming and RxJS. Not only you're exposed to an entirely new ecosystem with new APIs, but you also need the time to process this different paradigm of programming with streams. As we've experienced in previous articles, it can be quite different from a traditional writing code style (compared with imperative programming, for example).

Depending on how broadly you'll embrace this paradigm, you might need to ship new tooling for unit testing and master additional concepts such as <a href="https://rxmarbles.com/" target="_blank" title="RxMarbles: Interactive diagrams of Rx Observables">marble diagrams</a> - which helps you properly model and assert data streams. However, it might require you and your team to learn another tricky **DSL** (**d**omain-**s**pecific **l**anguage) to deal with these diagrams.

Some might argue that the "learning curve" is a "one-time cost". As it turns out, in the software industry, software engineers tend to move a lot (due to the high demand for the skill these days), and they might be sticking around in the same company for an average of 2 to 3 years before embracing a new challenge. The bustling job market makes me believe that it is not wise to think of the "learning curve" as a one time cost because soon, your freshly trained engineer with RxJS skills might say goodbye.

##### Debugging does not get any easier

Just the same way, you can split your code into several functions, and those functions call other functions which, without some structure, might end up in spaghetti code. Likewise, you can end up entangled in a spaghetti of streams and not know which way to turn. I think simple functions are usually more straightforward to debug, given that they are composed sequentially. You're reading a function; that function might call other N functions and so forth. Well, with streams, it might not be that candid because there's no such thing as a stream invoking another stream. Instead, you'll have a stream plugging with other streams in mixed ways depending on the operators that join them. It might feel overweighing at some point to find your way around some particular flow (hopefully, you won't' reach that point because your code is clear and concise).

Another aspect that you might run into while debugging streams is that such an amount of abstractions and compact implementation will let no space for you to plug into a stream and debug it or inspect it the same way you debug a function. Things tend to be on a higher level of abstraction - which is beneficial because it will free up your mind on some implementation details. Hence when it comes to the point you need to dig further down, understanding what's going on at the very core of your flow, you might need to <a href="https://www.learnrxjs.io/learn-rxjs/operators/utility/do" target="_blank" title="tap / do - Learn RxJS">tap</a> into streams here and there to figure out what's the issue. Although old this article, it might be one of the best walkthroughs of the problem I'm trying to surface here. It will give you a solid strategy to debug streams (even if you're looking at that particular code for the first time) - _tip for reading it: mentally replace `do` per `tap`_.

##### Human creativity

**Kiss**: **K**eep **i**t **S**imple, **S**tupid, not easy with reactive streams and RxJS tough. I'll tell from personal experience that it will come the day you'll look at your code, and although it's just fine, you'll feel this **voice inside your head: "Are you sure there's nothing else much fancier in the RxJS API that would allow you to write less two lines of code?" - fight that voice!** Creative solutions with RxJS might often result in dreadful consequences for your product and team. But yet, RxJS has such a unique and evolving ecosystem that will feel tempting with time to start to chime in some new operators just for the sake of adding more operators. Fight that in code reviews - this is the place you can understand why your colleague is shipping that new exotic operator and challenge simpler alternatives already in use. I guess this is general advice. I wouldn't apply it to reactive programming only. If you don't have a code review process, ¯\\\_(ツ)\_/¯.

##### With great power

As usual, with powerful tools, there is increased responsibility towards their use. If you pick RxJS as your weapon of choice, there are things you'll need to be extra careful. I want to highlight one: shareReplay. We didn't look into this operator in particular during this series, but we did learn the difference between <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals#hot-observable-vs-cold-observable" target="_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Hot and Cold observables</a>, a quick refresher:

- **Hot Observables** - multicast; all subscribers get data from the same producer (e.g., a live music concert in a stadium).
- **Cold Observables** - unicast; each subscriber gets data from different producers (e.g., a show on Netflix).

<a
href="https://www.learnrxjs.io/learn-rxjs/operators/multicasting/sharereplay"
target="\_blank"
title="shareReplay - Learn RxJS"

> shareReplay
> </a> allows you to take a cold observable and make it hot in the sense that you can now multicast the underlying computation
> to multiple subscribers 🤯 - that's <b>share</b>. With this operator, new subscribers will be able to "catch up" with
> previously emitted values at any point in time - that's <b>replay</b>.

Don't want to get into extensive detail of what the operator pertains to; be mindful of your implementation gaps that might trigger massive memory leaks in your application by using this operator. The gist is that **using shareReply without refCount may origin a memory leak because the operator doesn't automatically close the stream** after all its consumers' have unsubscribed.

Also, historically, there have been some issues around its implementation [[1]](https://github.com/ReactiveX/rxjs/issues/3336) [[2]](https://github.com/ReactiveX/rxjs/issues/5034).

##### Error handling

Finally, yet notably, error handling. Something I did not cover in the previous articles. Error handling is yet something else that changes considerably. Let's look at a simple example comparing reactive vs. non-reactive.

```javascript title="try...catch"
switchMap(event => {
  try {
    const id = event.target.id;
    resEl.innerHTML = `loading item ${id}...`;
    console.log(`Fetching data for item ${id}...`);
    return fetchById(id);
  } catch (error) {
    // that's not how this works with streams...
  }
}),
map(response => {
  resEl.innerHTML = JSON.stringify(response, null, 2);
  console.log(`Done fetching data for item ${response.item.id}!`);
}),
```

```javascript title="catchError"
switchMap(event => {
  const id = event.target.id;
  resEl.innerHTML = `loading item ${id}...`;
  console.log(`Fetching data for item ${id}...`);
  return fetchById(id);
}),
catchError(error => {
  if (error) {
    console.error(error);
  }
  // fallback to an empty item and a message
  // we need to return an observable!
  return of({
    item: {},
    message: 'something went wrong',
  });
}),
map(response => {
  resEl.innerHTML = JSON.stringify(response, null, 2);
  console.log(`Done fetching data for item ${response.item.id}!`);
}),
```

For a more natural integration, you'll have to stick with the <a href="https://www.learnrxjs.io/learn-rxjs/operators/error_handling/catch" target="_blank" title="catch / catchError - Learn RxJS">catchError operator</a>. As a beginner, I would tend to wrap stuff around with try/catch, but things work slightly differently with streams. Observable is our primitive here, remember?
Something mentioned as a <a href="https://medium.com/@benlesh/on-the-subject-of-subjects-in-rxjs-2b08b7198b93#.pcmlgg1mx" target="_blank" title="On The Subject Of Subjects (in RxJS) | by Ben Lesh | Medium"><i>"gotcha"</i> of RxJS</a> **is the fact that an RxJS Observable does not "trap" errors**; when an error bubbles to the end of the observer chain, when unhandled, the error, it will be re-thrown.

#### Closing notes

Would I use reactive programming and RxJS in my next project? **Depends...** There's a great deal of learning involved in using these technologies, so even though I might not always use them, I'm confident that these skills will (and are!) playing an essential role in my evolution as a software engineer. Just know that **I would do it again** (all the learning and writing).

I do think Reactive is powerful and useful, but it's not a holy grail that will solve all your problems overnight.

**Please focus on the problem first, scrutinize the use cases, and Reactive shall reveal itself a solution.**

I hope you've enjoyed this series is now approaching its end. This series is far from the perfect learning resource, but I hope that my perspective and way of explaining things fit some of you, complementing your learnings in a way. To close, I'll leave you with a <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">list of fantastic learning resources for reactive programming and RxJS</a>.

<br />

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="\_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>
