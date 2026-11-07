# The Weekly Inference newsletter

Signup boxes live on `/the-weekly-inference/` (above the issue list) and at the end of every issue.
Both are rendered by `src/components/NewsletterSignup.astro` (styles are scoped inside it). The text above the
form comes from the `label` prop. The form posts to [Buttondown](https://buttondown.com).

## Why Buttondown

- Plain HTML form POST: no client JS, no API keys in the repo, works on a static GitHub Pages build.
- Double opt-in, unsubscribe links, and GDPR handling are built in.
- Has an API for sending emails, which the sending script uses (see below).

## Setup

1. Create a Buttondown account. Your **username** becomes the newsletter slug
   (`buttondown.com/<username>`).
2. `newsletter.buttondownUsername` in `src/config.ts` is set to `danielcaldas`. If your Buttondown
   username is different, change it there; it's the only place it's set.
3. In Buttondown settings:
   - Newsletter name: `The Weekly Inference`. Add a short description and sender name.
   - Keep **double opt-in** on (prevents spam signups via the public form).
   - Optional: set a custom confirmation/redirect URL, e.g. `https://danielcaldas.github.io/the-weekly-inference/`.
4. Test: run `pnpm start`, submit your own email on `/the-weekly-inference/`, confirm the
   opt-in email arrives, and check the subscriber appears in Buttondown.

## Sending issues

Issues aren't sent from this repo. A local script sends each new issue through the Buttondown API.
Keep the Buttondown API key on your machine (for example in an environment variable) and never commit it.
Buttondown's RSS-to-email feature isn't used.

## Switching providers

Only the form `action`, the hidden `embed` field and the `embeddable-buttondown-form` class in `NewsletterSignup.astro` are Buttondown-specific.
The local sending script would also need to move to the new provider's API.
Most providers (Kit, Mailchimp, EmailOctopus) accept a similar HTML form POST with an `email` field.
