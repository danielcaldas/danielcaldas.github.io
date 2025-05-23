---
title: 'Deleted my git stash! Please send help!'
description: 'You can author content using the familiar markdown syntax you already know. All basic markdown syntax is supported.'
pubDate: 2018-12-09
tags: ['ops']
---

I have this poor habit you know... Whenever I accumulate a lot of git stashes in some repository I just get a little maniac and start cleaning everything.

![please send help](./assets/please-help-deleted-my-git-stash/please-send-help.jpg 'please send help doggo meme')

<Caption source="https://me.me/i/please-send-help-none-c0081e69a4f4419a824e82a234ac09e6" />

I found it sometimes even funny to open the terminal and play around with some bash to delete the stashes, look:

```bash
# if you're just flashing by don't copy and past this line into your terminal
for i in {1..10}; do git stash drop; done
```

Well, it happens that today (a few hours ago actually) I just did this and regretted the moment I did because there was this huge feature that for some reason I had locally stashed and not committed <br/> ¯\\\_(ツ)\_/¯.

**Good news!**, the commits are not actually gone until git runs <a href="https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)#Reachability_of_an_object" target="_blank" title="wiki page garbage collection">_garbage collection_</a>, so to check the list of commits that might still be rescued just go ahead and type:

```bash
git fsck --unreachable
```

or maybe

```bash
git fsck --unreachable | grep commit
```

because you actually need to check whether your hash is somewhere referenced as a **unreachable commit**.

Then all you need to do once you find your _stash_ (if you don't know the hash I'm afraid you will have to apply stashes until you find it) is just:

```bash
git stash apply <hash>
```

Here, some cool references on git stash:

- <a href="https://www.atlassian.com/git/tutorials/saving-changes/git-stash" target="\_blank" title="atlassian tutorials git stash">Atlassian - Git stash</a>
- <a href="https://community.atlassian.com/t5/Sourcetree-questions/Retrieve-a-deleted-stash/qaq-p/162673" target="\_blank" title="atlassian community recover deleted stash">Atlassian community - Retrieve a deleted stash</a>

Notice that the references above are from Atlassian, which I highly recommend when it comes to quick search into a specific Git topic.

And that's it, hope this saves you just like it saved me.

Have a nice day.
