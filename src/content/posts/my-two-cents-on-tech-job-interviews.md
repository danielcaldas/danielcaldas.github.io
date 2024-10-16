---
title: 'My 2 cents on (tech) job interviews'
description: 'My 2 cents on (tech) job interviews'
pubDate: 2018-12-18
tags: ['job-market']
---

Well... A few months have passed since I published my first blog posts and since then I stacked up quite a few topics that I wanted to talk about, and job interviews are one of them. In this post I'll tell you about the current process that companies within the tech industry use to recruit these days. To give you some context I'll write about my first (first worth sharing) personal experience on searching for a job as a Software Engineer, a search that led me to the role of JavaScript Engineer at trivago in mid 2018 and fall 2019.

I left my first job at <a href="https://blip.pt/jobs/" target="_blank" title="blip find a job">blip</a> to join <a href="https://company.trivago.com/careers/open-positions/" target="_blank" title="trivago opened positions">trivago</a>, but I don't want to talk about my new job, instead I want to go all the way back to November 2017 and share my experience about facing several job interviews for different companies.

For a few years I had this aspiration of living in a different country in order to get to know new cultures, travel and also because I deeply believed (not past tense, I'll still do believe) that it would do great good for my personal and professional development.

I started out really slow throwing around some CVs just to see what would happen.. Well not much happened. You see I was in my first job (1 year of experience) as a software engineer and had just finished my master's... I was already aiming for international jobs at companies such as Google, Facebook or Spotify, of course I did not even get an opportunity to interview at those companies my CV would be filtered out automatically I guess...

Entering 2018 I thought to myself: _"Woah, easy there, let's think with both feet on the ground and really aim to more realistic opportunities and not just apply to jobs randomly and expect it to work!"_.
And it was indeed a good decision I started to spend more time analyzing the companies and the opportunities where I could indeed be a good candidate.
Soon positive emails start to fill in my inbox with requests to schedule interviews for the upcoming weeks/months.

### The process

A few interviews passed and it seemed that all companies would fall into this same process to hire new personnel (of course I'm referring to the software engineer role or similar):

1. **HR call** - just to do some background check, knowing candidate expectations, also a good point to get to know the company before deciding on moving forward, duration ranging from 20 to 40 minutes.
2. **Technical challenge** - a task more focused on the field where the candidate applies, tasks' duration ranging from hours to 1 week (insane right! 1 week!).
3. **Video call interview** - with some engineer probably someone with a role close to what the candidate applies to. Here normally two things can happen (not mutually exclusive):

- You will do a **walkthrough on the technical task of step 2.** and explain you're decisions while answering technical questions that might be or not related with the task at all but it always has the task has the baseline to conduct the interview.
- The task is not mentioned at all which means that it was more of a filter to exclude candidates that do not match the expertise/skill required for the position. Here various things happened to me, since answering **more generic computer science questions** to **discussing the trends on a certain technological field** (in my case Javascript).

4. **Final on sight interview (or another video call)** - here questions and challenges might not belong only on the technical realm, you will face behavioral questions, process questions, good practices and so on...

### Typical questions

Below a list of the most frequent questions. I'll break them down into two groups: technical and non-technical.

#### Introduction/Background check/Soft skills questions

- To start, tell me a little bit about yourself, your experience, your background and current job.
- Why are you applying for this job?
- Describe your previous role.
- Tell me something about your current job that you don't like (and one that you like).
- Tell me about yourself and your career so far.
- Do you have experience with the technologies _A_ or _B_?
- How does your ideal work environment look like?
- What do you value in your current job that you would also like to have in some new job?
- What are your salary expectations?
- Is salary your main criteria for the new position you're looking for?
- What are you looking for in your new job?
- Are you currently employed? If yes, what is your notice period?
- What are your plans for the rest of the day?
- Tell me about one project/task where you were active and that for some reason did not go very well. Why
  did it went wrong and whose fault it was.
- What was the last thing that you read/learned about front end? <small>(in my case front end, but I imagine this could go along with any other expertise as well)</small>
- In this paper there is code from a pull request. Please describe how you would go about
  doing the code review. Write comments on the paper but explain yourself along the way.
- There are three boxes, one contains only apples, one contains only oranges, and one contains both apples and oranges. The boxes have been incorrectly labeled such that no label identifies the actual contents of the box it labels. Opening just one box, and without looking in the box, you take out one piece of fruit. How many pieces of fruit do you need to take from the boxes in order to be able to label the boxes correctly?

#### Technical questions

- What's the difference between an array and a linked list in terms of complexity?
- What's the difference between a set and a hashmap? Can you give concrete examples where you would use
  one over the other?
- Write a function that given a string it returns a boolean that indicates whether that string is a <a href="https://en.wikipedia.org/wiki/Palindrome" target="_blank" title="Wikipedia palindrome">palindrome</a>.
- You have 1 hour. Pick your framework of choice and let's build a currency exchange calculator in a pair
  programming session.
- Have you used async/await? If yes please explain a little how this improve the way we do IO comparing
  to an approach using promises.
- Build a function that given a list of elements which can be of any type, returns the sum of the elements in the list that are numbers (please consider that numbers can appear as strings or in the middle of strings as well e.g. "include the number 11 on the count").
- What's the difference between an inner join and an outer join?
- Write the function _atoi_ (alpha to an integer) (without casting the string to a number).
- Write the function _itoa_ (integer to alpha) (without casting the number into a string).
- Write the function reverse that given a string returns the reversed version of it (**important**: you cannot use an auxiliary array to implement the algorithm).
- Implement <a href="https://gist.github.com/jaysonrowe/1592432" target="_blank" title="gist for fizz buzz">fizz buzz</a>.
- What's a balanced tree?
- How could you represent a tree using data structures?
- Implement <a href="https://en.wikipedia.org/wiki/Breadth-first_search" target="_blank" title="Wikipedia breadth-first search">Breadth-first search (BFS)</a> algorithm.
- Implement <a href="https://en.wikipedia.org/wiki/Depth-first_search" target="_blank" title="Wikipedia Depth-first search">Depth-first search (DFS)</a> algorithm.
- What data structure better suites a autocomplete search field? (<a href="https://en.wikipedia.org/wiki/Trie" target="_blank" title="Wikipedia trie">checkout trie</a>)

### That question I always ask

> What's the worst part of working at ...?

The cool thing is, you get to ask a question as well! I particularly found very helpful to ask this question to my
interviewers: _"What's the worst part of working at your company?"_. You can get a few things out of this question.
If they replied right away with something specific enough I can immediately tell the following about the company:

- They have reasonably good transparency with employees since main issues can straight away be identified and explained.
- It simply may happen that this bad thing is something that you don't tolerate at all thus it will make you consider moving onto the next interviews.
  If during the answer you get the fell that the people interviewing you try to go around the question (which it's not a very smart thing to do let's be honest) maybe you'll get the feeling that they are trying to hide something from you and there's a good chance that you're feelings are right.

### "Homework" assignments

Yes, if you have a full-time job what would you expect? Of course you need to give up a few of those lovely weekends, but please just make it worth, even if you're not confident that you're test case will succeed at least try and learn something from it, otherwise it's just a waste of nice weekends (been there, done that).

I've no really solid position on this topic, I agree that companies need somehow to access your skill, but I think this should not be some automated score that excludes you. Test cases should be taken seriously from both sides and they should be an indication that the candidate taking the test has already some real changes to actually get the job.

I'm just impressed how simply people start to accept the fact that you need to work for free during a not that small amount of time to be considered for some job position.

Below are a list of a few assignments that companies request me to do, just so that you have an idea of the kind challenges you could face out there:

- You have two APIs that provide you positions and information of taxi vehicles, please build an app that fetches and displays this information in an uniform and useful way. If possible display the vehicles information within a map (e.g. using google maps API).
- Build an interface that performs currency exchange conversion using some currency conversion rates API (something similar to what you see when you convert currencies on google except for the line chart part)
- Build a shopping cart with a list of items that you can dynamically add/edit/remove from the shopping cart (discounts and that kind of shit can be applied...). In this particular challenge the company sent me a layout that I was supposed to implement like "_pixel perfect_". Although they provided all the graphical assets and SASS stylesheets
  with color palettes and some elements already ready to use. I just found this challenge to require way too much effort.
- You have an API that retrieves products from a supermarket, for each product you have the detail, price and image. Use this information to display the information in a convenient way to consult it also needs to be responsive. Special requirement is that on mobile instead of show the detail of the product you just show the name and when the product is clicked it opens a different page with the product information.
- Build a <a href="https://en.wikipedia.org/wiki/T9_(predictive_text)" target="_blank" title="t9 predictive text wiki page">t9 (predictive text)</a> number to word list converter as a Node backend and React/Redux fronted. For this challenge the whole commit history can be checked in this public repository <a href="https://github.com/danielcaldas/el-conversor" target="_blank" title="el-conversor Github repository">danielcaldas/el-conversor</a>.
- Build a classic _todo list_ using javascript only. After that try and use a JavaScript framework instead to implement the exact same app, then some smaller and more detailed tasks followed as optional work, stuff like:
  - Try and change the layout of the todo list via a query parameter;
  - Try to improve tolling, add hot reload for CSS files (using webpack).

### Takeaways

These are the things I wish I knew before.

- **Ask questions, the soon the better** - it's your new job that we are talking about here, just don't hold back any questions that you may have, sometimes the answer to a simple question may reveal something that changes or greatly reinforces your opinion on the company and your will to move forward with the process.
- **"Salary is not relevant" is bullshit** - at the end everything is about money.
- **Be aware of the benefits and counterbalance them with the base salary**.
- **SYAO** - Yes, study your ass off. Practice and read a lot. Here a few good resources to get you started:
  - <a href="http://www.crackingthecodinginterview.com/" target="\_blank" rel="nofollow"   title="Cracking the Coding Interview: 189 Programming Questions and Solutions"> Cracking the Coding Interview</a> - If you're going to interview for companies that focus Algorithms &amp; Data Structures questions, this is a very good resource. It contains a curated list of tipical problems. It will teach you how to reason about problem solving questions and to to better approach them.
  - <a href="https://github.com/trekhleb/javascript-algorithms" target="\_blank" title="algorithms and data structures implemented in javascript with explanations and links to further readings">trekhleb/javascript-algorithms</a> - Algorithms and data structures implemented in JavaScript with explanations and links to further readings.
  - <a href="https://github.com/leonardomso/33-js-concepts" target="\_blank" title="33 concepts every javascript developer should know">leonardomso/33-js-concepts</a> - 33 concepts every JavaScript developer should know.
  - <a href="https://github.com/h5bp/Front-end-Developer-Interview-Questions" target="\_blank" title="a list of helpful front-end related questions you can use to interview potential candidates, test yourself or completely ignore">h5bp/Front-end-Developer-Interview-Questions</a> - A list of helpful front-end related questions you can use to interview potential candidates, test yourself or completely ignore.
  - <a href="https://github.com/yangshun/tech-interview-handbook" target="\_blank" title="algorithms study materials, behavioral content and tips for rocking your coding interview">yangshun/tech-interview-handbook</a> - Algorithms study materials, behavioral content and tips for rocking your coding interview.
  - <a href="https://github.com/yangshun/front-end-interview-handbook" target="\_blank" title="almost complete answers to 'front-end job interview questions' which you can use to interview potential candidates, test yourself or completely ignore"> yangshun/front-end-interview-handbook</a> - Almost complete answers to "Front-end Job Interview Questions" which you can use to interview potential candidates,test yourself or completely ignore.
  - <a href="https://github.com/kdn251/interviews" target="_blank" title="everything you need to know to get the job">kdn251/interviews</a> - Everything you need to know to get the job.
- **Lean about the company (and not only the "culture")** - learn as much as you can... office location, employees reviews, are people leaving or coming, how is the company performing financially, what technologies do they use, what projects are they working on stuff like that check out <a href="https://www.glassdoor.com/" target="_blank" title="Glassdoor is a website where employees and former employees anonymously review companies and their management">_glassdoor.com_</a>, it's also nice to check the companies' <a href="https://github.com/" target="_blank" title="Github inc. is a web-based hosting service for version control using git">_github.com_</a> profile to check if there are actively engaged with the open source community.
- **It's ok to be nervous** - yes.
- **Fail** - _“Don't bury your failures. Let them inspire you.”_ - it's not an original quote, but it fits just great here and kind of sums up what I wanted to say.
- **Be honest** - I remember one of this technical interviews, this guy telling me: _"Ok, now let's do some SQL questions to see how you doing..."_. My first thought was _"That's it, I'm fucked!"_, but then I didn't lose my time or theirs, I was straightforward and told him that I have very limited knowledge of SQL, never done it in a real job only had this university class that gave me some basics on database design and little bit of SQL and that's it, the guy said that it was ok and he appreciated my honesty, still I passed to the next interviews round.
- **Don't ever drop performance on your current job** - You're still employed? Then make sure that this _parallel life_ of yours does not interferes with your current job, they are the ones paying your salary not the companies you are interviewing.
- **Leaving your current job? Don't forget to keep connections with your old colleagues keeping the doors open** - especially if you enjoyed your previous company (as I did) make an effort to keep in touch.
- **Take the technical tasks seriously and face them as an opportunity to learn**.
- **Take notes, learn from your mistakes** - It's important that you take notes and here's why. On my first few sets of interviews I thought I could just be super concentrated and memorize important details or simply wrote them down after the interview. Well I couldn't, it happens
- **Be patient** - These days recruitment processes may take ages (can take up to several months!) so just don't be actively waiting around for the next reply otherwise it just drives you mad, just keep going with your life normally without letting this affect your stress levels too much.
- **Be persistent** - It may happen that you do 10 interviews and you don't succeed, on one hand this can be a huge source of frustration and disappointment, but on the other
  hand remember that you getting each time more experiment and more comfortable around this interviewing stuff and that experience it's powerful! You're just increasing your odds to succeed on the next interview at each failed one.

### Be prepared for your new challenge

If you're persistent you'll get that job, I have no doubts. Now, once you get that cool gig you worked so hard for, you'll want to keep performing well! Try and be proactive from day one.

### Dear recruiters please do not...

- Please do not approach someone with an offer if the person in question had just started a new job in that same week.
- Please do not let candidates _hanging_, even if the response not positive please communicate, even if it is an auto-generated email saying that the candidate was excluded from the selection process.
- Please do not ask to the candidate if it's possible to deliver a task that supposedly takes 1 week to complete two or three days after you send the task to the candidate? Wait, is the candidate working for your company already?
- Schedule calls and interviews with care, don't forget relevant details such as the fact that the candidate might live in some country with a different timezone.
- Please do not ask candidates to do long homework assignments to exclude them due to something minor like the "style" of the code or too much over-engineering, this things can be detected with a 10 minutes coding interview by solving a simple challenge that demonstrates how the candidate approaches problems, both abstractly and implementation-wise.

### Final note

Again much of the written above is just my opinion. I hope you find useful some of the sections of this post even if you don't work on the tech industry.
