# The Weekly Inference newsletter

Signup boxes live on `/the-weekly-inference/` (above the issue list) and at the end of every issue.
They're rendered by `src/components/NewsletterSignup.astro` and post to [Buttondown](https://buttondown.com).

## Why Buttondown

- Plain HTML form POST: no client JS, no API keys in the repo, works on a static GitHub Pages build.
- Double opt-in, unsubscribe links, and GDPR handling are built in.
- Has RSS-to-email, which can send new issues straight from the existing feed at
  `https://danielcaldas.github.io/the-weekly-inference/rss.xml`, so nothing in the publishing flow changes.

## Setup

1. Create a Buttondown account. Your **username** becomes the newsletter slug
   (`buttondown.com/<username>`).
2. Set `newsletter.buttondownUsername` in `src/config.ts` to that username
   (it currently holds the placeholder `theweeklyinference`).
3. In Buttondown settings:
   - Newsletter name: `The Weekly Inference`. Add a short description and sender name.
   - Keep **double opt-in** on (prevents spam signups via the public form).
   - Optional: set a custom confirmation/redirect URL, e.g. `https://danielcaldas.github.io/the-weekly-inference/`.
4. Turn on RSS-to-email (Buttondown → Automations / RSS feed):
   - Feed URL: `https://danielcaldas.github.io/the-weekly-inference/rss.xml`
   - Behaviour: send each new item immediately (or save it as a draft first if you'd like to review it).
   - The feed already includes the full HTML of each issue, so the email contains the whole issue.
   - Check Buttondown's current pricing page: RSS automation and the subscriber cap depend on the plan.
     Without it, paste each new issue into a Buttondown email manually.
5. Test: run `pnpm start`, submit your own email on `/the-weekly-inference/`, confirm the
   opt-in email arrives, and check the subscriber appears in Buttondown.

## Switching providers

Only the form `action` and field names in `NewsletterSignup.astro` are Buttondown-specific.
Most providers (Kit, Mailchimp, EmailOctopus) accept a similar HTML form POST with an `email` field.
