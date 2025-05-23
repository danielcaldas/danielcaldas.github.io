---
title: "There's something off about Open Source"
description: 'OSS dilemma'
pubDate: 2020-12-16
tags: ['open-source', 'opinion']
---

> **Update Oct 12th 2024**
>
> I didn't modify this article. I don't fully agree with my views here anymore. The problem is not on FOSS, but rather on peoples' expectations and approach to FOSS. I'm still of the opinion that FOSS is not at a fully sustainable stage. Major projects today are typically funded and it's no longer rare to see full-time employed developers work on maintaining FOSS these days.

There's no company out there these days that doesn't rely on Open Source Software (OSS) to some extent. Well, at least that's what I believe it's the case. I think something is off about OSS or the perception of it anyway.

I've seen people rambling on tweeter; sometimes, it goes like this:

> **Person A**: "My OSS package has thousands of weekly downloads!"
>
> **Person B**: "Congrats, great job. Keep going!"
>
> **Person A**: "Hmm... looks like some big company is using my software. The least they could do would be to sponsor me on GitHub or something, right?"
>
> **Person B**: _(quietly leaves the room)_

Although platforms such as <a href="https://github.com/sponsors" target="_blank" title="GitHub Sponsors">GitHub Sponsors</a> or <a href="https://opencollective.com/" target="_blank" title="Open Collective - Make your community sustainable. Collect and spend money transparently">Open Collective</a> (which are great, btw!) exist today, there's no such thing as an economically sustainable ecosystem for OSS. I see projects like <a href="https://webpack.js.org/" target="_blank" title="bundle your scripts">Webpack</a>, massively used. If you look at their Open Collective profile today, they have an estimated annual budget of a bit more than 200K USD. That's great, but what you we probably fail to realize is that: **critical people behind Webpack made a decision at some point, the decision to make it open**. Perhaps we could today live in a world where Webpack is a successful and lucrative SASS company? But we don't. Webpack is free for you to use, and its source is available for you to tweak around if you have that much time on your hands.

I think we are still in the early stages of OSS, and society is yet a bit far away from recognizing how fundamental OSS is. The role they play in the technologies we use daily. Non _tech-savvy_ people are mostly not aware of it. On our side (the _tech-savvy_ people), we build up the wrong expectations about creating and maintaining OSS projects. **If your primary goal is to get money from it, build a business. If you make your code open, you are willingly giving it away for free. This means other developers and companies (no matter how big) are free to use it as they please**. This is something you should reason about from day one if your expectations sit on building some revenue source. Of course, you can cut deals with the companies, collaborate as a contractor _yadda yadda yadda_ and make some cash. Don't merely assume those entities using your software are obligated to pay you or help you in any way (well, not legally, maybe morally). That's just not how it works.

#### The "give back to the community" deal

> "Oh, but this company X, built most of their stuff with OSS, they must give back to the community."

I fell you. There's resentment, bitterness. Thinking that the company _X_ has millions of cash flow and doesn't even consider the value your OSS plays in its products, by making a simple donation. That's one of the "perks" of being an _open sourcerer_. **If your primary goal is to get money from it, build a business**.

#### OSS is an endangered species

I believe OSS is at risk. I think in the long run, attempts to build businesses around OSS might damage its core values, which I believe are:

1. OSS is released under a license in which the copyright holder **grants users the rights to use, study, change, and distribute the software to anyone and for any purpose**.
2. OSS is famous for being **developed in a collaborative public manner**.

Aiming to build an economically sustainable OSS could potentially incur in one of the two things (just a theory of course):

1. New types of licenses will start popping up. Regulations would be put in place to ensure that companies using OSS, that generate ridiculous amounts of cash, distribute part of the revenue with the OSS projects equitably. Which breaks property `1.` mentioned above.
2. Some parts of the OSS become private, breaking `2.` mentioned above. This means that collaboration becomes limited (limited to the actual open parts of the source code)

I'm mostly worried about the last point. Would this mean that restrictions on who can contribute to the source would damage its quality? Simultaneously, would software companies that are just starting out be completely crashed because they now have to pay for every software they use?

This is quite a dilemma for me. I'm interested to see how all this is going pan out. My bet is on the money. Money wins, most of the time.
