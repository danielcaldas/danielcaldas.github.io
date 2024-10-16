---
title: 'Reactive Series (pt. 2) - Fundamentals of Reactive Programming'
description: 'Reactive Series (pt. 2) - Fundamentals of Reactive Programming'
pubDate: 2020-09-03
tags: ['javascript', 'reactive-programming']
---

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- **Part 2 - Fundamentals of Reactive Programming**
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="\_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>

<br>

- [The Observer Pattern](#the-observer-pattern)
  - [Observer Pattern: Real-Life Analogy](#observer-pattern-real-life-analogy)
  - [Naming the things we already know](#naming-the-things-we-already-know)
  - [A naive use case for the Observer pattern in JavaScript](#a-naive-use-case-for-the-observer-pattern-in-javascript)
  - [Observable as a first-class citizen](#observable-as-a-first-class-citizen)
- [Reactive Programming](#reactive-programming)
  - [Core Properties of Observables](#core-properties-of-observables)
  - [Stream](#stream)
  - [Operators](#operators)
  - [Hot Observable VS Cold Observable](#hot-observable-vs-cold-observable)
  - [Brief History of Reactive Programming](#brief-history-of-reactive-programming)
  - [Quotes](#quotes)

Let's continue our journey on Reactive Programming. This part will highlight some of this paradigm's key concepts for quick learning.

#### The Observer Pattern

You might have encountered several diagrams and explanations of the Observer pattern. For those of you that might not yet be familiar
with it, allow me to explain it with an example-based approach, a very different one than what I had at school.

> "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically." by <a href="https://sourcemaking.com/design_patterns/observer" target="_blank" title="Observer Design Pattern">sourcemaking.com</a>

I didn't get it for the first time with this definition and set me away instead of fascinating me. I thought this would be
a super tricky thing to get. But not if you've had **explained it to me with something we all know** like youtube.

##### Observer Pattern: Real-Life Analogy

Let's look at _youtube.com_ for a second. I'll use it as an example to explain this pattern's **two core participants**: **Observer** and **Observable**.

Your browsing on youtube and you find a new **channel**. You want to **receive notifications** anytime some new
**content is published into that youtube channel**, but for that, you'll need to **hit the subscribe button first**. You are the **Observer**, consuming the content posted (published) by that youtube channel. This makes the youtube channel the **Observable**. Another vital aspect to see is the multiplicity of this relationship. There's **one youtube channel to many youtube users** (subscribers).

##### Naming the things we already know

Keeping this analogy in mind, let's clarify a couple more concepts that complement the relationship between an Observable and its Observables.

- **Producer or creator** - something that generates/publishes content. Back to our analogy, the content creator is the youtube
  channel owner. An Observable produces data.
- **Consumer or client** - something that subscribes to new content (data) published by the producers; our user is the consumer in our analogy. He or she gets notified when new content is out.
- **Subscription** - think of it as an object that holds the information about you subscribing to that youtube channel. One crucial thing that the subscription must own is a way for you to unsubscribe from that youtube channel when you no longer want to be notified of new content.
- **Pull** - we talk about a pull protocol when a consumer/client explicitly decides when to get data from the producer/creator. For instance, when we create a simple function and call it to do some work for us.
- **Push** - in these systems, the consumer/client doesn't know exactly when new content is published. Our youtube analogy describes such a system where the channel subscribers have no clue when a new video will be posted.

These concepts are more comfortable to follow when backing them up with some real-life example, but most importantly, it is good that you possess a **grasp of the jargon**. **It's crucial to clearly express yourself** with your peers. Last but not least, this **becomes super relevant when you're trying to Google your away around some issue**.

##### A naive use case for the Observer pattern in JavaScript

Now let's get our hands on and implement the Observer pattern for our youtube case study. The idea is to use the Observer pattern to notify many youtube users when a new video is published into the channel. We'll keep the example slim and straightforward. The main idea is to have an end-to-end perception of how the data flows in our application when using Observables. We won't have a UI here. We will just use `console.log` to signal some events in our small program.

```javascript
class Video {
  constructor(title) {
    this.title = title
  }
}

class Channel {
  constructor(name, subscribers = []) {
    this.name = name
    this.subscribers = subscribers
    this.videos = []
  }

  // subscribes a user to an instance of channel
  // returns the unsubscription function
  subscribe(user) {
    this.subscribers.push(user)

    const userIndex = this.subscribers.length - 1

    // remember we need to allow our users
    // to unsubscribe anytime
    const unsubscribe = () => {
      this.subscribers.splice(userIndex, 1)
    }

    return unsubscribe
  }

  // publishes a new video in this channel notifying
  // all its subscribers
  publish(video) {
    this.videos.push(video)
    this.subscribers.forEach((user) => {
      user.notify(`
        Hey there ${user.email}!
        There's a new video from ${this.name}
        ${video.title}
    `)
    })
  }
}

class User {
  constructor(email) {
    this.email = email
  }

  // just logs a notification update
  notify(update) {
    console.log(update)
  }
}

function main() {
  // our platform has 3 users: elisa, hans and mark
  const elisa = new User('elisa@gmail.com')
  const hans = new User('hans@gmail.com')
  const mark = new User('mark@gmail.com')

  // our platform has 1 channel "#FunnyVide0s"
  const funnyVideosChannel = new Channel('#FunnyVide0s')

  // Our scenario

  // elisa, hans and mark hit the subscribe button on "#FunnyVide0s"
  const subscriptions = [elisa, hans, mark].map((user) => {
    return funnyVideosChannel.subscribe(user)
  })

  // oh! it seems a new video is about to come out on "#FunnyVide0s"
  const newVideo = new Video('funny cats (part 1)')
  funnyVideosChannel.publish(newVideo)

  // no! is seems like elisa didn't like the video "funny cats (part 1)"
  // she unsubscribes from the channel
  const unsubscribeElisa = subscriptions[0]

  unsubscribeElisa()

  // but "#FunnyVide0s" it's not going to stop!
  // we have a new cats video, of course this time
  // only Hans and Mark are notified
  const yetAnotherNewVideo = new Video('funny cats (part 2)')
  funnyVideosChannel.publish(yetAnotherNewVideo)
}

main()
// The output is:
//
// Hey there elisa@gmail.com!
// There's a new video from #FunnyVide0s
// funny cats (part 1)
//
// Hey there hans@gmail.com!
// There's a new video from #FunnyVide0s
// funny cats (part 1)
//
// Hey there mark@gmail.com!
// There's a new video from #FunnyVide0s
// funny cats (part 1)
//
// Hey there hans@gmail.com!
// There's a new video from #FunnyVide0s
// funny cats (part 2)
//
// Hey there mark@gmail.com!
// There's a new video from #FunnyVide0s
// funny cats (part 2)
```

Let's map the entities of the above example:

- The `User` is our `Observer`.
- The `Channel` is our `Observable`.
- The `Video` is just really the contract for the payload we sent out to subscribers, it **can really be anything**.

I hope this example clarifies that you can leverage the Observer pattern with no additional libraries in any programming language. I found this knowledge of paramount importance to understand more complex use cases in reactive programming, specially when using libraries, we sit as a client, we go one layer of abstraction above what you've seen in the previous example. With reactive programming libraries, you can juggle with Observables in fantastic ways effortlessly.

As a side note, if you're keen on learning more about the Observer pattern (or any other design pattern), I highly recommend the following resources:

- <a href="https://sourcemaking.com/design_patterns/observer" target="_blank" title="Observer Design Pattern">sourcemaking.com</a>
- <a href="https://en.wikipedia.org/wiki/Design_Patterns" target="\_blank" rel="nofollow" title="Design Patterns: Elements of Reusable Object-Oriented Software">Design Patterns: Elements of Reusable Object-Oriented Software</a>
- <a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/" target="\_blank" rel="nofollow" title="Learning JavaScript Design Patterns">Learning JavaScript Design Patterns</a> - a better resource if you want to learn these concepts with JavaScript.

##### Observable as a first-class citizen

> "Observables never had a chance to shine on their own. The real win, IMO, to RxJS is the Observable type itself. Not the operators." from <a href="https://dev.to/benlesh/observables-reactive-programming-and-regret-4jm6" target="_blank" title="Observables, Reactive Programming, and Regret - DEV">"Observables, Reactive Programming and Regret"</a>

Observables are everywhere these days. Libraries such as RxJS has an internal implementation of an Observable type, an refers to it as a <a href="https://en.wikipedia.org/wiki/First-class_citizen" target="_blank" title="First-class citizen - Wikipedia">first-class citizen</a>.

I would like to highlight the <a href="https://tc39.es/proposal-observable/" target="_blank" title="TC39 – Specifying JavaScript, Observable proposal">tc39 Observable proposal</a>. Observables are a very natural fit to handle many programming challenges. I think this has become more noticeable given that people are even considering bringing it into the language (in this case JavaScript)! I believe we are blurring the line between language specification and library, but I'm happy to see the proliferation of Observables' discussions.

#### Reactive Programming

**Reactive Programming is programming with streams of data. Streams are vessels of values pushed over time. Streams can be transformed into and combined with other streams**.

**To make the above clearer**, let's go over a few essential concepts, those you'll hear all the time.

##### Core Properties of Observables

There are **3 very important aspects about Observables** in reactive programming. Maybe some of them don't make sense now, but they will, once you have some hands-on experience with some reactive library.

**Observables are**...

- **a primitive type** with 0 to many values, pushed over any amount of time (yes, mentioned quite a few times already).
- **cancellable**, you can cancel a subscription by sending stuff to these observables: "I don't' want you to send me those values anymore."
- **lazy. Observables don't do anything until you subscribe.** This is the complete opposite of <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" title="Promise - JavaScript | MDN">Promises</a>. Promises are eager, that's why we often wrap them in a function, making them lazy, so they only execute when we call them.

##### Stream

An overused term these days, but I'll try to make it simple.
First of all, **a stream is an Observable**; you'll find that these two concepts are often interchangeable. Simply put, a stream is a collection of values pushed over time. Let's think of _"live streaming"_ in the video industry for a moment; on one end, there's your laptop observing the stream; on the other end, something is pushing several bits of data over the wire. Simple right? But **how to think about streams in the conceptual world**? That's where diagrams (more precisely marble diagrams) come in handy. At the most basic level, a stream is simply represented by a horizontal line, representative of time, with geometric figures. Each figure represents an emitted value on the stream. What's an emitted value? If a stream emits a value, it means that everyone looking into the stream will get notified of that value. Hopefully, the following figure makes it crystal clear.

<br />

The following represents a stream that emits 4 values (1 value emitted per second).

!['simple stream animation of four values pushed over time'](./assets/reactive-programming-fundamentals/stream-basic-four-values.gif 'stream animation')

<cite>source: https://rxviz.com/</cite>

<br />

From now on, whenever you hear **"stream"**, try to visualize the above in your head.

##### Operators

Streams alone are useful as they allow multiple Observers to subscribe to it for updates. Things start to get more enjoyable when you want to **manipulate a stream**. As mentioned, streams can be transformed and even combined. The power it's all yours. Let's look at two essential operations, **mapping, and filtering**. Take a look at the following animation.

<br />
<br />

!['visualization of map and filter when applied to streams'](./assets//reactive-programming-fundamentals/map-filter-stream.gif 'map and filter stream')

<cite>source: https://reactive.how/filter</cite>

<br />

As you can see on the left, `map` applied over the left-most stream generates a new stream of values where each value in the original stream goes through the function `isEven` provided to the mapping operation. Subscribing to this stream, you would get a boolean (true vs. false) or number (0 vs. 1) that tells you whether a given value is even or odd. Now let's look at filter. With `filter`, instead of transforming each value, you're actually creating a new stream that only emits the original value when the same it's even. So from an Observer perspective, you would be notified half of the times, while with map your Observer will be notified for every single value.

##### Hot Observable VS Cold Observable

This is a concept that I've experienced before understanding it, and it can be daunting.

A **Hot Observable** emits values before the subscription happens. **Think of it as a live music concert in a stadium**. You will only get to see the full performance if you enter the stadium (subscribe) before the show starts (stream emits values). Of course, you can arrive at the venue to see the concert at any future time. Everyone at the stadium shares the same experience (meaning the values are shared among subscribers).
In a real use case, a Hot Observable can be a stream of click events on the page (there might be clicks happening before you subscribe to it) in a user interface.

A **Cold Observable** only starts emitting values upon subscription. **Think of it as a movie on Netflix**. The film only starts playing once you press play on your laptop. You won't miss pieces of the movie since you can start playing from the very start. If someone else watches the same movie on Netflix, they won't share your timeline; each user has its own individual timeline (values are not shared among subscribers).
In a real use case, a cold Observable can be a countdown clock where each subscriber has its own clock.

##### Brief History of Reactive Programming

According to my research in the paper <a href="http://conal.net/papers/icfp97/" target="_blank" title="Functional Reactive Animation paper">Functional Reactive Animation (1997)</a>, we see some first mentions to things such as: **reactivity**. Some kind of temporal representation animations resembles the concept of a stream.

Haskell mentions in its WiKi page <a href="https://wiki.haskell.org/Functional_Reactive_Programming" target="_blank" title="Functional Reactive Programming - HaskellWiki"></a>:

> "Functional Reactive Programming (FRP) integrates time flow and compositional events into functional programming."

The phrasing here is bit complicated. There's this concept of a primitive type called `Behavior`, which is defined as a time-varying value. This resembles a stream, right? A stream is somehow a time-varying value since you can get different values pushed to the stream over time, not that the reference to the stream changes, but its contents instead.

Today reactive is not only used to manage animated user interfaces. **It's on every platform, from the web to mobile, from UIs to servers.** Here's a couple of the most famous reactive programming libraries today:

- <a href="http://baconjs.github.io/" target="\_blank" title="Bacon.js - Functional Reactive Programming library for JavaScript">bacon.js</a>
- <a href="https://vertx.io/" target="_blank" title="Eclipse Vert.x">
    vertex.io
  </a>
- <a href="http://reactivex.io/" target="_blank" title="ReactiveX">
    ReactiveX
  </a>(<a href="https://github.com/ReactiveX/RxJava" target="_blank" title="ReactiveX/RxJava: RxJava – Reactive Extensions for the JVM – a library for composing asynchronous and event-based programs using observable sequences for the Java VM"
  >RxJava</a>, <a href="https://github.com/ReactiveX/RxSwift" target="_blank" title="ReactiveX/RxSwift: Reactive Programming in Swift">RxSwift</a>, <a href="https://github.com/ReactiveX/rxjs" target="_blank" title="ReactiveX/rxjs: A reactive programming library for JavaScript"
  >RxJS</a> and others)
- <a href="https://kefirjs.github.io/kefir/" target="\_blank" title="Kefir.js — fast and light Reactive Programming library for JavaScript inspired by Bacon.js and RxJS">kefir</a>

##### Quotes

I hope this section offers some other views (and their sources) on reactive programming, expressed in a different way that might complement or even wholly build your understanding of things so far.

> "Reactive Programming raises the level of abstraction of your code so you can focus on the interdependence of events that define the business logic, rather than having to constantly fiddle with a large amount of implementation details"

<small>
  <a
    href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754"
    target="_blank"
    title="The introduction to Reactive Programming you've been missing"
  >
    "The introduction to Reactive Programming you've been missing"
  </a>
</small>

<br />

> "When you fully embrace RP, the core of your app ends up being a declaration of a graph through which your data flows."

<small>
  <a
    href="https://dassur.ma/things/streams-for-reactive-programming/"
    target="_blank"
    title="Streams for reactive programming"
  >
    "Streams for reactive programming"
  </a>
</small>

<br />

> "Never store a mutable state on your types. Instead, when you generate a new value in response to a change, send it in to a channel."

<small>
  <a
    href="https://www.cocoawithlove.com/blog/reactive-programming-what-and-why.html#a-description-of-reactive-programming"
    target="_blank"
    title="What is reactive programming and why should I use it?"
  >
    "What is reactive programming and why should I use it?"
  </a>
</small>

<br />

It's good that you discovered these concepts before you jump into practice. In my opinion, these can't be absorbed only by reading. Go over to the next blog post, where we'll build a small game together so that you can materialize the things I've covered in this blog post.

<br>

- <a href="https://danielcaldas.github.io/posts/why-reactive-programming" target="\_blank" title="Why You Should Consider Reactive Programming | danielcaldas.github.io">Part 1 - Why You Should Consider Reactive Programming</a>
- **Part 2 - Fundamentals of Reactive Programming**
- <a href="https://danielcaldas.github.io/posts/hands-on-reactive-programming-rxjs" target="\_blank" title="Hands-on Reactive Programming with RxJS | danielcaldas.github.io">Part 3 - Hands-on Reactive Programming with RxJS</a>
- <a href="https://danielcaldas.github.io/posts/reactive-rxjs-pros-cons" target="\_blank" title="Reactive Programming: The Good and the Bad | danielcaldas.github.io">Part 4 - Reactive Programming: The Good and the Bad</a>
- <a href="https://danielcaldas.github.io/posts/awesome-reactive" target="\_blank" title="Awesome RxJS and Reactive Programming Resources | danielcaldas.github.io">Part 5 - Awesome RxJS and Reactive Programming Resources</a>
