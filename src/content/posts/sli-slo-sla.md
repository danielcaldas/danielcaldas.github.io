---
title: SLIs, SLOs and SLAs in 2 minutes
description: Measuring the service level of your application
pubDate: 2020-08-13
tags: ['ops']
---

#### Service Level Indicator (SLI)

> An SLI is a service level indicator — a carefully defined quantitative measure of some aspect of the level of service that is provided.

<small>
  <a
    href="https://landing.google.com/sre/sre-book/chapters/service-level-objectives/"
    target="_blank"
    title="Google - Site Reliability Engineering"
  >
    source: Google SRE book
  </a>
</small>

**Examples**: error rate; request latency; throughput (e.g., requests p/second); availability (time the service is usable); durability (for
data storages: the confidence of retaining data over time).

##### Where and how to measure them?

- **Processing server logs** - derive them from server-side logs. You can do this on the fly or retroactively with some post-processing job that runs on your records and collects data to backfill your SLI information.
- **Application-level metrics** - capture individual request metrics' performance at the application level (e.g., how long did the server took to perform a particular operation).
- **Front-end metrics** - getting closer to the users. We can measure key user interaction points with some (out of the box) tooling made available by cloud providers. We can also perform some manual logging in specific checkpoints of the user journey with the help of platforms such as <a href="https://www.datadoghq.com/" target="_blank" title="Cloud Monitoring as a Service | Datadog">datadog</a>.
- **Synthetic clients** - this method consists of implementing bots that emulate user interaction to make sure it's possible to complete a user journey. Bots are just an approximation of the real user behavior. Users are creative and often do unexpected things. Synthetic clients generally require higher implementation effort. The previous two arguments make synthetic clients one of my least preferred methods.

#### Service Level Objective (SLO)

> An SLO is a service level objective: a target value or range of or a service level that is measured by an SLI. A natural structure for SLOs is thus SLI ≤ target, or lower bound ≤ SLI ≤ upper bound.

<small>
  <a
    href="https://landing.google.com/sre/sre-book/chapters/service-level-objectives/"
    target="_blank"
    title="Google - Site Reliability Engineering"
  >
    source: Google SRE book
  </a>
</small>

I'm new to this, but I would stick with a range of values as much as possible.
The SLO maps to the SLI by adding boundaries. It sets a goal for an SLI over a period of time.

#### Service Level Agreement (SLA)

> service level agreements: an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs they contain.

<small>
  <a
    href="https://landing.google.com/sre/sre-book/chapters/service-level-objectives/"
    target="_blank"
    title="Google - Site Reliability Engineering"
  >
    source: Google SRE book
  </a>
</small>

It might be useful to think of the SLA as your answer: _"What happens if one fails to comply with the agreed SLOs?"_
