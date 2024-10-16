---
title: 'Reactive Series (pt. 1) - Why You Should Consider Reactive Programming'
description: 'Why You Should Consider Reactive Programming'
pubDate: 2020-07-23
tags: ['javascript', 'reactive-programming']
---

- **Part 1 - Why You Should Consider Reactive Programming**
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>

---

In the first part of my <a href="https://danielcaldas.github.io/posts/series-reactive-programming-rxjs/" target="_blank" title="Reactive Series | danielcaldas.github.io">series on Reactive Programming</a>, I
want to answer why you should consider Reactive Programming. My answer to this question is heavily based on my experience working on
building complex user experiences that often deal with asynchronicity in the browser. I won't cover much on how Reactive
Programming, would help your platforms scale by providing out of the box solutions to
handle <a href="https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7" target="_blank" title="Backpressure explained — the resisted flow of data through software | by Jay Phelps | Medium">backpressure</a>. Still, I
believe that the principles throughout this series can be extended to other ecosystems/platforms/programming languages.

#### From callbacks to async/await

At first, <a href="https://en.wikipedia.org/wiki/Callback_(computer_programming)" target="_blank" title="Callback (computer programming) - Wikipedia">callbacks</a> were the primary
way for us to handle asynchronicity in JavaScript. Callbacks allow us to write code that is not yet ready to be executed because its parameters depend
on the execution of some task(s) that will be complete in the future. Fastly we began to gain acquaintance
with the <a href="http://callbackhell.com/" target="_blank" title="Callback Hell">callback hell</a>.

```javascript
doSomething(param1, param2, function(err, paramx) {
  doMore(paramx, function(err, result) {
    insertRow(result function(err) {
      yetAnotherOperation(someparameter, function(s) {
        somethingElse(function(x) {
          // ...
        });
      });
    });
  });
});
```

Somewhere down the road, jQuery 1.5 introduced <a href="https://api.jquery.com/category/deferred-object/" target="_blank" title="Deferred Object | jQuery API Documentation">Deferred Objects</a> to
manipulate callback queues and provide an alternative to manage asynchronicity. By this time, the concept of <a href="https://en.wikipedia.org/wiki/Futures_and_promises" target="_blank" title="Futures and promises - Wikipedia">Futures and Promises</a> was
not new to computer science.

It was not until <a href="https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015" target="_blank" title="ECMAScript - Wikipedia">ECMAScript 2015</a> - The 6th edition, initially
known as ECMAScript 6 (ES6) - that we got <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" title="Promise - JavaScript | MDN">Promises</a> as
a standard built-in object in the language. Before landing in ES6, Promises had already disrupted the JavaScript
ecosystem. Libraries such as <a href="http://bluebirdjs.com/docs/getting-started.html" target="_blank" title="Getting Started | bluebird">bluebird</a>, which
has been around since 2013, have made it possible for JavaScript programmers to handle asynchronous code with Promises.
But why Promises were such a game-changer? Mainly because they provide a higher abstraction on top of the callback pattern. With
Promises, you get a reference to an object that holds the resolution/failure of some future value. That reference
is chainable. You can easily return a Promise from a function and proceed with your program flow on the callee instead of propagating
the chain of events down through the callback hell. Great!

```javascript
function something() {
  return doSomething(param1, param2)
}

function main() {
  something().then((err, paramx) => {
    // do stuff
  })
}
```

Again a new anti-pattern is born. We tend to attach to names emotionally, so the "hell" is back, but this
time, instead of callback hell, we have the Promise hell.

```javascript
function something() {
  return doSomething(param1, param2)
}

function main() {
  something().then((err, paramx) => {
    doMore(paramx).then((err, result) => {
      insertRow(result).then((err) => {
        // ...
      })
    })
  })
}
```

The thing with Promises is that they're also tempting to nest, resulting in extremely verbose code.

In the <a href="https://en.wikipedia.org/wiki/ECMAScript#7th_Edition_-_ECMAScript_2016" target="_blank" title="ECMAScript - Wikipedia">7th and 8th editions of ECMAScript</a>, we
are given the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank" title="async function - JavaScript | MDN">async function</a>, a new
mechanism to battle the complex challenge that is asynchronicity. This time we have an even higher order of abstraction, where inside an
async function, you can handle asynchronicity and making it look exactly like synchronous code. It seems a very promising
breakthrough, and the community goes all in. Although **async functions are just syntactic sugar on top of Promises, they bring us**
**enormous advantages**:

- By replacing Promises with async functions, we no longer end up in the scenario where there are endless `.then` chains
  spread throughout the codebase.
- Generally, the code is cleaner. The flow of functions is more natural to read, even when it performs async work. The only
  difference we notice is the presence of the async keyword.
- Triggering things conditionally becomes way more straightforward. Say two asynchronous tasks are co-dependent. To execute
  the request `B`, we depend on data provided by request `A`. We can simply `await` on `A`, and with an `if` statement
  checks, the data returned from `A` to decide whether we need to trigger request `B`.
- Error handling seems to improve since one can use try/catch block to handle errors on rejected Promises, while
  with Promises, one needs to chain a catch and provide a callback to handle the error.

After broad usage of async/await, the community started again, **raising some cons on the construct**:

- **Poorly explained syntax errors** (e.g., missing an `await` keyword).
- It **promotes a less functional style** of coding, something that the JavaScript community has gained increasing excitement
  over the past few years.
- It **opens the door to the design of less performant solutions** because it's just easy to drop an await to get something working
  quickly but block the execution of other steps of the functions that, with a bit more effort, could be done in parallel. Other
  anti-patterns such as iterating over a collection while performing an `async/await` task for each element, but this is
  something one could quickly point out during code review.
- The **transpiled output of async/await code is just something not pleasant to look at**, much less to debug. Transpiled, because
  if you're still supporting Internet Explorer, you're probably bundling polyfills for async/await.
- The way synchronous code bridges over to async functions it's something yet confusing for me. It's something that it's not
  transparent. I found my self often jumping to the signature of the function I'm invoking to check whether it performs some asynchronous
  task or not. How could I lose track of something like that reading through some large codebase? Perhaps it's my fault I'm just
  not doing it right.

I want to reinforce that we came to a long road since callbacks, and the enhancements are noticeable, but after some time, mentions
to the **"async/await hell"** started to surface across the web.

```javascript
;(async () => {
  const pizzaData = await getPizzaData() // async call
  const drinkData = await getDrinkData() // async call
  const chosenPizza = choosePizza() // sync call
  const chosenDrink = chooseDrink() // sync call
  await addPizzaToCart(chosenPizza) // async call
  await addDrinkToCart(chosenDrink) // async call
  orderItems() // async call
})()
```

<small>
  <i>
    example from:{" "}
    <a
      href="https://medium.com/free-code-camp/avoiding-the-async-await-hell-c77a0fb71c4c"
      target="_blank"
      title="How to escape async/await hell. async/await freed us from callback… | by Aditya Agarwal | freeCodeCamp.org | Medium"
    >
      "How to escape async/await hell"
    </a>
  </i>
</small>

Generally speaking, something I learned over time, is that if a solution has many corner cases, requiring you to look into the
documentation (e.g., error handling in async/await VS Promises), it means that:

- The solution's not intuitive enough.
- By not being intuitive, it's not evolving in the same line of reasoning of the coder's mind.

**But what if everything is asynchronous? What if synchronous and asynchronous code looks the same?** I believe this is the best way
to shape our mindsets into producing highly readable and performant code. How would we achieve that? **Observables, Reactive Programming**.

But Reactive Programming is **not only about** tackling the complicated job of handling **asynchronicity**. There are other amazing advantages
that this paradigm facilitates:

- **A mental framework** to use your <a href="https://en.wikipedia.org/wiki/Event-driven_programming" target="_blank" title="Event-driven programming - Wikipedia">event-driven programming</a> skills in
  a **more data-oriented**. Event-driven programming is only about programming user/system actions (e.g., mouse clicks), what if you could apply
  this same model not only to events but also to data (e.g., changing data X triggers a change to data Y).
- **Functional Programming & Immutability** - it's all about generating values to respond to a change. Changes trigger
  the creation of new values, naturally promoting <a href="https://en.wikipedia.org/wiki/Immutable_object" target="_blank" title="Immutable object - Wikipedia">immutability</a>.
- **Single Code Styling** - you'll be exposed to a **higher abstraction level** of cofing where handling tasks with Promises
  or other asynchronous mechanisms can look like any other code that does not involve asynchronicity.
- **State Management** - by following the reactive way, state updates tend to be sequential, we'll often find a solution that will help
  us eliminate some annoying global variables hanging around our code. This will become clear once we jump into our small application
  that I'll present later on in this series.
- **Performance** - from <a href="https://jaxenter.com/the-fight-for-performance-157515.html" target="_blank" title="The fight for performance – Is reactive programming the right approach? - JAXenter">"The fight for performance – Is reactive programming the right approach?"</a>, there's a
  discussion around how Reactive Programming can overcome some potential bottlenecks caused by native threads in
  Java. In <a href="http://lup.lub.lu.se/luur/download?func=downloadFile&recordOId=8932146&fileOId=8932147" target="_blank" title="Reactive programming and its effect on performance and the development process, Gustav Hochbergs">this master's thesis</a>, the
  author boards on a journey to compare a real application's performance when migrated over to an approach based on Reactive Programming
  libraries. In short, it seems that there are no conclusive results in regards to CPU or memory usage when comparing a synchronous
  approach with a Reactive approach, but one thing stands out. The reactive approach seems to keep a good throughput under high load, where
  there's the need for processing data in super short time intervals (5ms), here is where the Reactive approach shines the most.

There's one thing I need to mention, though, which is what most of the above sources where I've been reading about Reactive Programming
have in common. Although we've seen Reactive Programming taking the higher ground in several aspects compared to traditional paradigms, its
complexity seems to be one of the main barriers to its adoption. Reactive **implementations are said to have a higher maintenance cost compared**
**to a conventional programming style**. I can't argue this, the learning curve is steep, but once you pass that the rewards are noteworthy and
things that in other times you would think of impossible or had to implement become so much easier.

If you feel like taking a shot at Reactive Programming, I'll gladly guide you through it!

<br />

- **Part 1 - Why You Should Consider Reactive Programming**
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>
