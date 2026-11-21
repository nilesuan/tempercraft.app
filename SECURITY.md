# Security policy

## Reporting a vulnerability

If you think you've found a security problem in Tempercraft, please tell us privately. Don't open a public issue, discussion or pull request about it.

Report it through GitHub's private vulnerability reporting: open this repository's **Security** tab and choose **Report a vulnerability**. Only the maintainers can see your report.

Helpful details:
- what's affected, such as the app version or the website page;
- the steps to reproduce the problem;
- what an attacker could do with it.

Don't include real tokens, passwords or other people's data. If you need to share something sensitive, say so in your report, and we'll arrange a safer way to send it.

## What's covered

| Product | Covered |
|---|---|
| The Tempercraft macOS app | The latest code on `main`, and the latest release |
| tempercraft.app and dev.tempercraft.app | The websites and the functions behind them |
| This repository | Source code, configuration and build scripts |

Services we use but don't run aren't covered. That includes OpenAI, Google and Firebase, Resend, Sentry, Cloudflare and GitHub. Please report problems in those to the provider.

## Testing boundaries

You may test the app on your own Mac, with your own accounts and data. Please don't:
- access, change or delete other people's accounts or data;
- run load or denial-of-service tests against tempercraft.app or our Firebase services;
- send spam or phishing, or try to trick anyone involved with Tempercraft.

This policy accepts reports; it doesn't authorize any other testing. If you're unsure whether something is in bounds, ask in a private report first. If you come across someone else's data, stop, don't keep a copy, and tell us in your report.

## What to expect

Tempercraft has one maintainer, so we aim to:
- acknowledge your report within 7 days;
- send you an update at least every 30 days until it's resolved;
- fix confirmed problems as quickly as their severity requires.

We'll tell you if we can't reproduce a problem, if it's already known, or if it belongs to a third party. With your agreement, we'll pass third-party problems on to the provider.

## Disclosure and credit

Please keep the details private until a fix is released, or until 90 days after your report, whichever comes first. If we need more time, we'll explain why and agree a date with you.

We're happy to credit you in the advisory under the name you choose, or keep you anonymous. There's no bug bounty.
