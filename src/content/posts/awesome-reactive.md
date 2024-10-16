---
title: Reactive Series (pt. 5) - Awesome Resources for Reactive Programming
pubDate: 2021-02-12
tags: ['javascript', 'reactive-programming']
description: 'My notes on the epic JSConf EU 2018'
---

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- **Part 5 - Awesome RxJS and Reactive Programming Resources**

Here we are! Thanks for riding along in this journey. As promised, I'll compile in an organized manner a collection of resources that will help you sharping those reactive programming skills and built a better understanding of many of these concepts that are so abstract.

#### Visualization

These are some of the best websites/tools that I know.

- <a href="https://rxviz.com" target="_blank" title="animated playground for rx observables">
    Rx Visualizer Animated playground for Rx Observables
  </a> - excellent code to animation playground. Suitable for limited complexity use cases, remarkable for learning.
- <a href="https://www.learnrxjs.io" target="_blank" title="introduction, learn rxjs">
    Learn RxJS
  </a> - because the official documentation can be a bit heavy and lacking examples for specific areas, this is a resource
  that I often utilize.
- <a href="https://reactive.how" target="_blank" title="rxjs and reactive programming, animations and visual lessons">
    reactive.how
  </a> - here you can find the most beautiful and clean animations for the different Rx operators. Refer to this one for
  good visual explanations for operators.
- <a href="https://bitbucket.org/achary/rx-marbles/src/master" target="_blank" title="achary/rx-marbles on Bitbucket">
    rx-marbles
  </a> - my tool of choice to generate marble diagrams. I've used it to create the marble diagrams presented throughout this
  series. It has a nice DSL that allows you to generate marble diagrams programmatically, instead of dragging and dropping
  stuff around.
- <a href="https://rxmarbles.com" target="_blank" title="interactive diagrams of rx observables">
    rxmarbles.com
  </a> - more marble diagrams that depict the different Rx operators.
- <a href="https://www.rxjs-fruits.com/subscribe" target="_blank" title="rxjs-fruits.com is a game for learning RxJS">
    RxJS Fruits
  </a> - play this interactive game to learn Rx. A more fun way of learning. It brings that bit of <i>gamification</i> into
  the learning process, making the learning experience much more enjoyable.

#### Talks

- <a href="https://www.youtube.com/watch?v=B-nFj2o03i8" target="\_blank" title="video, complex features made easy with rxjs">Complex Features Made Easy With RxJS</a> - A demo of the power of RxJS. In this talk, the presenter builds complex features on top of an existing Angular application. The features comprehend things like animations, handling user events, and HTTP requests.
- <a href="https://www.youtube.com/watch?v=m40cF91F8_A" target="\_blank" title="video, creating an observable from scratch, live-coding session">Creating an observable from scratch (live-coding session) - Ben Lesh</a> - if you want to understand Observables' internals, this deep dive is the right resource. In this talk, you have the chance to see how to build an Observable (and even operators!) from scratch with interactive code examples.

#### Articles

These are loose articles that I read along the way, and they boost the understanding around those little details that are left out when you go through tutorials that cover the broad and most essential concepts. There are always those small bumps along the way, things we don't quite yet understand, but at some point their comprehension can play a pivotal role in the decisions that we make while we code!

- <a href="https://dev.to/benlesh/a-simple-explanation-of-functional-pipe-in-javascript-2hbj" target="\_blank" title="a simple explanation of functional pipe in javascript">A simple explanation of functional pipe in JavaScript</a> - Ben Lesh, project lead of RxJS project, walks through the internal decision making and thought process that led RxJS to incorporate the function <code>.pipe()</code> into its API.
- <a href="https://css-tricks.com/animated-intro-rxjs" target="_blank" title="an animated intro to rxjs">An Animated Intro to RxJS</a> - don't be mistaken by the title. In this article, not only you'll get comprehensive code snippets to trigger some cool animations with RxJS, but you'll also get a fair introduction to some of the base concepts of reactive programming and RxJS.
- <a href="https://medium.com/@jshvarts/read-marble-diagrams-like-a-pro-3d72934d3ef5" target="\_blank" title="understanding marble diagrams for reactive streams">Understanding Marble Diagrams for Reactive Streams</a> - an extensive walkthrough on several operators of the Rx API. It can be somewhat redundant if you can pick up things by looking at the documentation, but we're all different. Sometimes all it takes is another explanation for us to pick up that hard concept.
- <a href="https://rxjs-dev.firebaseapp.com/guide/testing/internal-marble-tests" target="\_blank" title="rxjs, writing marble tests">Writing Marble Tests</a> - you can approach unit testing with a similar pattern to procedural code. You can go with a <a href="https://medium.com/angular-in-depth/how-to-test-observables-a00038c7faad" target="\_blank" title="how to test observables the ultimate guide">"subscribe and assert way"</a> but there's a fair amount of caveats that you need to be aware of when doing so, such as the lengthy transformation of streams or calling <code>done</code> to signal the end of asynchronous operations. Marble tests are stream-oriented and enable you to perform assertions on higher-level stream representations in a less <i>boilerplate-ish</i> fashion than the "<i>subscribe and assert way</i>".
- <a href="https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87" target="\_blank" title="rxjs, don’t unsubscribe"> RxJS: Don’t Unsubscribe </a> - tl;dr leverage Rx itself to manage subscriptions instead of being worried about unsubscribing yourself and thinking about all the scenarios where you need to unsubscribe. You can think of it this way: "Can I code this in a way that streams will cleanup themselves?".
- <a href="https://medium.com/@puppybits/rxjs-is-great-so-why-have-i-moved-on-534c513e7af3" target="\_blank" title="rxjs is great. so why have i moved on">RxJS is great. So why have I moved on?</a> - a distinct point of view on how an alternative path to progress when we get to a point where we become overwhelmed by massive amounts of entangled streams in our codebase. <a href="https://developers.redhat.com/blog/2017/06/30/5-things-to-know-about-reactive-programming" target="\_blank" title="five things to know about reactive programming, red hat developer">5 Things to Know About Reactive Programming</a> - I've read this one more than once; beyond SPAs, reactive patterns have their advantages when applied to the server-side world - <i>examples in this article are in Java</i>.

<br />

That's all! I hope you've enjoyed this <a href="https://danielcaldas.github.io/posts/series-reactive-programming-rxjs" target="_blank" title="Reactive Series | danielcaldas.github.io">Reactive Series</a> as much as I did.

---

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/reactive-programming-fundamentals" target="\_blank" title="Fundamentals of Reactive Programming | danielcaldas.github.io">Part 2 - Fundamentals of Reactive Programming</a>
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- **Part 5 - Awesome RxJS and Reactive Programming Resources**
