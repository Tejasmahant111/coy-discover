# Part A: Two core features for Coy

Coy's promise is simple: add the people you have a crush on, and you only find out someone likes you if it's mutual. Both suggestions below protect that promise. They focus on the two moments where the product is weakest today: **after a match** and **while you wait for one**.

---

## 1. A safe "match handshake" before contact details are shared

**What it is.** When two people match, show a short confirmation step before any phone number or email is revealed:

1. Each person sees a prompt: *"You matched with someone you added as 'Priya (college)'. Is this the person you meant?"* They also see a hint of the other person's identity, such as their first name and masked number.
2. Both people tap **"Yes, that's who I meant"**. Only then are contact details revealed.
3. Optionally, the first few messages go through a lightweight in-app chat. People can say hi without handing over their WhatsApp number straight away.

**Why it's needed**

- **Crushes are added by phone number or email, and those don't always identify one person.** Numbers get recycled. Families share a phone. People make typos, and some have several emails. A "match" with the wrong person is the worst outcome for Coy: it reveals your crush to a stranger. A two-sided confirmation catches this before anything is revealed.
- **Safety, especially for women.** Today a match means immediately learning how to reach each other. A confirmation step, plus an optional in-app first conversation, lets people start talking without giving out a personal number. That lowers the risk of saying yes in the first place.
- **It turns a match into a conversation.** Right now the product hands off to WhatsApp at its happiest moment. An in-app icebreaker keeps that moment inside Coy, and it shows whether matches actually lead to conversations, which is the metric that matters.

---

## 2. Crush lifecycle: release a slot after a cool-down

**What it is.** Adding a crush stays final in the short term. After a cool-down (for example 60–90 days), you can **release** that slot and reuse it. Releasing is silent: the other person is never told, and if they add you later, nothing happens. Coy can also send a gentle reminder: *"It's been 3 months since you added someone. Keep waiting, or free up the slot?"*

**Why it's needed**

- **Feelings change, but slots don't.** With 3 free slots that are permanent, a user whose crushes never join, or who has moved on, has no reason to come back unless they pay. Many will simply churn. Letting slots refresh after a cool-down gives people a reason to return several times a year.
- **It keeps Coy's anti-probing rule.** Coy makes adding final so people can't add and remove names to test who likes them. A long cool-down keeps that protection, because you can't cycle through names quickly enough to learn anything. Releasing also never reveals whether the other person added you.
- **It makes paid slots feel fairer and helps conversion.** If free slots can't be reused, buying more feels like the only way out. With refreshes, users stay engaged longer, and the ones with several active crushes still buy extra slots to avoid waiting. A user who stays is worth more than one who pays once and leaves.
- **It keeps the network active.** Each reused slot is another heads-up message to someone who may not be on Coy yet, which is Coy's main growth loop. Stale slots do nothing for growth.
