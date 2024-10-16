---
title: Why are developers bad at (manually) testing their code?
pubDate: 2021-04-06
tags: ['software-testing']
description: Why are developers bad at (manually) testing their code?
---

Manual testing of any software it's a vital activity to ensure its quality and long-term stability. Together with their coding activities, developers test their code changes to understand if they produce the desired outcome without breaking any existing software functionality. So far, so good.

Today I'm writing a few points on **why developers are bad at manual testing** their own code changes, especially at detecting unwanted side-effects in areas of the software often unrelated to the modified parts.

I'm writing because, at this point in time, I have experienced two very different setups towards software testing:

1. As a developer, I write a piece of code, and **I'll have a dedicated tester** testing the product with my code change before my change is pushed to production.
2. As a developer, I write a piece of code, and **I'm alone responsible** for testing that code change before moving the change to production.

<small>
  <i>(both 1 and 2 follow standard code reviewing practices, but this is not relevant in this context)</i>
</small>

**Although slower, I believe that the 1st setup often results in much more stable software, and here are the reasons that back up my opinion.**

#### 1. The "Mental Bandwith" Problem

Year after year, I'm more convinced that I'm **at my best when I focus on one task at a time. Also, the more specific**
**the task, the better.** <a href="https://sloanreview.mit.edu/article/the-impossibility-of-focusing-on-two-things-at-once/" target="_blank" title="The Impossibility of Focusing on Two Things at Once">Science backs up the fact</a> that it's
naturally hard for humans to focus on two tasks of different nature simultaneously.

Now, if you're developing and testing your own code, you'll be stretching yourself as an individual to do two very different
tasks in nature. You'll also be performing constant context switching because this is what happens when you're testing your
code changes: _"Ok, let me check this case, and that case... Oh damn! Forgot to handle this in the code, should be just one_
_line, let me go back and add it... Alright! Back to testing where were we..."_. Of course, it always depends on how strict and
organized you can be, but overall, it is pretty hard to take your mind away from the underlying implementation **you** did!

As a developer testing my own code, I often tend to be as strict as possible in the sense that I'll avoid switching context until
I went through all the "bullet points" I wanted to cover. Nonetheless, because testing is also my responsibility, I'll probably dedicate
less energy to things such as refactoring the existing implementation, making it more readable, especially after I've manually tested
something thoroughly. Unit tests often give me a lot of confidence to do this, but that's not always the case. Some
functionalities (especially in the web platform) are tricky to capture in any form of automation.

#### 2. Emotional Attachment

**It's good to be proud of the code we write. But more or less, every developer grows some kind of emotional attachment to the code they write**, and
in my opinion, this attachment is proportional to the time you spend around a given task. It was not easy for me to assume
this, but I had to stop at some point and don't be afraid to throw my code away if necessary. When developers test their code, they
unconsciously (or sometimes event consciously) cut corners and avoid specific scenarios because they are afraid that their beloved
code would not make it. Suppose you have a tester trying out your change. In that case, you bring a second person to the table, **this**
**person it's not emotionally invested in the code, so it's easier for them to tell you that something is wrong**.

#### 3. The Big Picture

By manually testing the code of dozens of developers you work with, you'll probably come across different functionalities, variants, and
shapes of that software as a tester. **The tester then develops a transversal knowledge of the software as opposed to developers' knowledge, which**
**is often vertical**. Developers tend to work in specific verticals of a codebase, making them ignorant and continually less aware of what a given
change means to the whole project. Thus **I believe dedicated testers develop a more solid mental model of the software by constantly testing**
**changes and seeing the product evolve on its various fronts**.

#### 4. Role Specialization

Because testers allocate their efforts towards manual testing and other testing-related activities such as writing automation tests, they'll develop a more specialized set of skills appropriate for testing software. This involves:

- Getting familiar with different tools to automate their flows.
- Getting familiar with whatever technologies are employed to automate the testing process.
- Getting a sense of community by gathering with other testers working on the same project and joining external communities to expand or share their expertise.
- There are also developers that are particularly passitionate about this topic, why not let them go fulltime?

#### 5. A Fresher Pair of Eyes

An obvious statement. Often a fresher perspective brings value to the table. This doesn't apply only to software testing. Did it ever
happen to you being stuck at something, stopping, going for a walk, coming back, and suddenly the problem is no longer there? Well, the
same can happened if you get someone else help.

#### 6. The "My code is bulletproof" attitude

There will be times when it's tempting to just push a change because you know such a simple code change **(the famous "one-liner") can't**
**possibly break something else totally unrelated**. I was proven more than once that this is not true. Getting that tiny code change through a
streamlined process of code review and manual testing (by a second individual), it's totally worth it because, again, the quality assurance engineer often
has a broader understanding of the software from an end-user perspective. As a developer, I have to make sure I clearly communicate
through the proper channels (usually documentation in the Pull/Merge request) the intent of my change.

See ya 👋
