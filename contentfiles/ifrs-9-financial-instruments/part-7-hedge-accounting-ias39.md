# IFRS 9 Financial Instruments — Part 7: Hedge Accounting — IAS 39 Framework

## Why Study IAS 39 Hedge Accounting?

IFRS 9 contains its own hedge accounting chapter (Chapter 6), which replaced IAS 39's hedge accounting requirements. However, you must understand both for three reasons:

1. **Exam relevance**: Many exam questions are set in the context of transitioning from IAS 39 to IFRS 9, or require you to compare the two frameworks.
2. **Transition provisions**: When IFRS 9 was adopted, entities were permitted to continue applying IAS 39 hedge accounting. Some entities — particularly those with macro hedging programmes — still apply IAS 39 hedging while the IASB finalises IFRS 9 macro hedge accounting.
3. **Foundation for IFRS 9**: IFRS 9 hedge accounting builds on IAS 39 concepts. You cannot understand what changed without understanding what was there before.

---

## The Purpose of Hedge Accounting

Before diving into the mechanics, understand *why* hedge accounting exists.

### The Accounting Mismatch Problem

Consider a South African mining company (Harmony Gold) that:
- Has a forecast sale of 10,000 oz of gold in 6 months (unrecognized — not yet a financial asset)
- Enters into a forward contract to sell gold at a fixed price (a derivative — recognized at fair value)

**Without hedge accounting:**
- The forward contract is marked to market each quarter → gains/losses in P/L
- The forecast gold sale is not recognized → no offsetting entry
- Result: artificial P/L volatility that doesn't reflect the economic reality of a hedged position

**With hedge accounting:**
- The gains/losses on the derivative are matched with the gains/losses on the hedged item
- P/L reflects the *net* economic exposure, not the gross movement on the derivative alone
- This better represents the entity's actual risk management activity

> [!IMPORTANT]
> Hedge accounting is an **exception** to the normal accounting rules. It requires meeting strict qualifying criteria. Entities cannot simply apply it because they think they have an economic hedge.

---

## The Three Types of Hedges

Both IAS 39 and IFRS 9 recognize three types of hedge relationships:

| Hedge Type | Hedged Item | Risk Being Hedged | Example |
|-----------|-------------|-------------------|---------|
| **Fair Value Hedge** | A recognized asset, liability, or firm commitment | Changes in fair value | Fixed-rate debt hedged with an interest rate swap |
| **Cash Flow Hedge** | A highly probable forecast transaction or variable-rate asset/liability | Variability in cash flows | Forecast USD export hedged with a forward contract |
| **Net Investment Hedge** | A net investment in a foreign operation | Foreign exchange risk | USD subsidiary equity hedged with USD borrowing |

---

## IAS 39 Qualifying Criteria

Under IAS 39, **all six** of the following criteria must be met for hedge accounting to apply:

### 1. Formal Designation and Documentation

At inception, the entity must prepare formal documentation covering:
- The hedging relationship
- The entity's risk management objective and strategy
- Identification of the hedging instrument
- Identification of the hedged item
- Nature of the risk being hedged
- How the entity will assess effectiveness

> [!CAUTION]
> Documentation is not optional or retrospective. If it is not done at inception, hedge accounting cannot be applied — even if everything else qualifies. This is a common real-world pitfall.

### 2. The Hedging Instrument

Under IAS 39, qualifying hedging instruments are:
- **Derivatives** (forwards, futures, options, swaps) — most commonly used
- **Non-derivative financial instruments** — only for hedges of foreign currency risk

An entity **cannot** designate a non-derivative as a hedging instrument for interest rate risk or commodity price risk under IAS 39.

Written options (where the entity receives a premium) are generally **not** permitted as hedging instruments unless they are used to offset a purchased option in the hedged item.

### 3. The Hedged Item

Qualifying hedged items include:
- A recognized financial asset or liability
- An unrecognized firm commitment (for fair value hedges)
- A highly probable forecast transaction (for cash flow hedges)
- A net investment in a foreign operation

**Cannot be hedged items under IAS 39:**
- Held-to-maturity investments (for interest rate risk or prepayment risk)
- An entity's own equity instruments
- Forecast transactions that are not highly probable

### 4. The Hedge Must be Expected to be Highly Effective

IAS 39 requires the hedge to be **highly effective** — a term defined with quantitative precision.

### 5. Effectiveness is Reliably Measurable

The fair value or cash flows of both the hedging instrument and the hedged item must be reliably measurable.

### 6. Ongoing Assessment of Effectiveness

Effectiveness must be assessed **prospectively** (at designation and each reporting date) and **retrospectively** (on actual results).

---

## The IAS 39 Effectiveness Test: The 80–125% Rule

This is the most distinctive (and criticized) aspect of IAS 39 hedge accounting.

### The Quantitative Test

> The 80–125% test is mechanical — and examiners expect you to calculate the ratio, state whether it falls within range, and conclude. Don't skip any of those steps; each one earns marks.

A hedge is considered highly effective under IAS 39 if the ratio of:

```
Change in fair value / cash flows of the hedging instrument
─────────────────────────────────────────────────────────
Change in fair value / cash flows of the hedged item

falls within the range of 80% to 125%
```

**Example:**

| | Gain/Loss |
|--|--|
| Hedging instrument (forward contract gain) | +R1,050,000 |
| Hedged item (bond fair value loss) | −R1,000,000 |

Effectiveness ratio = R1,050,000 / R1,000,000 = **105%** → Within 80–125% → Highly effective ✓

**Another example:**

| | Gain/Loss |
|--|--|
| Hedging instrument gain | +R700,000 |
| Hedged item loss | −R1,000,000 |

Effectiveness ratio = R700,000 / R1,000,000 = **70%** → Outside 80–125% → Not effective ✗

If the hedge fails the test at any assessment date, **hedge accounting must be discontinued** from that date.

### Problems with the 80–125% Rule

- **Cliff effect**: A hedge that is 79% effective gets no hedge accounting treatment; 80% gets full treatment
- **Arbitrary threshold**: There is no theoretical basis for the 80–125% range
- **Mechanistic**: Economic hedges that don't meet the ratio are excluded even if the risk management is sound
- **Volatility from exclusion**: When hedge accounting is lost, the derivative's full fair value movement hits P/L

These problems were a primary driver for IFRS 9's principles-based effectiveness approach (see Part 8).

---

## Type 1: Fair Value Hedge Accounting

### Objective

To offset the exposure to changes in the fair value of a recognized asset, liability, or firm commitment.

### Accounting Treatment

| Item | Treatment |
|------|-----------|
| Gain/loss on hedging instrument | Recognized in **P/L** |
| Gain/loss on hedged item (attributable to hedged risk) | Recognized in **P/L** (adjusting the carrying amount of the hedged item) |

The key insight: the hedged item is **adjusted** to reflect the fair value movement attributable to the hedged risk — even if it would normally be carried at amortised cost. This adjustment is called the "hedge adjustment" or "basis adjustment."

### Worked Example: Interest Rate Swap — Fair Value Hedge

**Facts:**
- Entity issues a 3-year fixed-rate bond at 8% (face value R10,000,000) — liability at amortised cost
- Enters into a receive-fixed, pay-floating interest rate swap to convert the fixed rate exposure to floating
- At year end: interest rates rise → fair value of bond falls → fair value of swap (asset position) rises

| | Gain/(Loss) |
|--|--|
| Swap (hedging instrument): fair value gain | +R200,000 |
| Bond (hedged item): fair value decrease attributable to interest rate risk | −R200,000 |

**Journal Entries — Year 1:**

```
Gain on hedging instrument (swap):
Dr  Swap Asset                       200,000
    Cr  Fair Value Gain (P/L)                   200,000

Loss on hedged item (bond — hedge adjustment):
Dr  Fair Value Loss (P/L)            200,000
    Cr  Bond Payable (hedge adjustment)          200,000
```

**Net P/L impact**: R200,000 gain − R200,000 loss = **NIL** ✓

The two P/L movements cancel out — this is exactly the purpose of fair value hedge accounting.

---

## Type 2: Cash Flow Hedge Accounting

### Objective

To offset the exposure to variability in cash flows attributable to a particular risk associated with a recognized asset/liability or a highly probable forecast transaction.

### Accounting Treatment

| Component | Treatment |
|-----------|-----------|
| **Effective portion** of gain/loss on hedging instrument | **OCI** (deferred until the hedged cash flow affects P/L) |
| **Ineffective portion** of gain/loss on hedging instrument | **P/L immediately** |
| When hedged transaction occurs and affects P/L | **Reclassify** from OCI to P/L |
| When hedged transaction results in a non-financial asset/liability | **Basis adjustment** (include in cost of asset) OR reclassify from OCI when affects P/L |

> [!IMPORTANT]
> Only the **effective** portion goes to OCI. Any ineffectiveness (gain/loss on the derivative that doesn't offset the hedged item) goes straight to P/L. This is where the 80–125% test has bite — large ineffectiveness means large immediate P/L charges.

### Worked Example: Forward Contract — Cash Flow Hedge

**Facts:**
- Sasol expects to purchase 1,000,000 barrels of crude oil in 6 months (highly probable forecast transaction)
- Enters into a forward contract to buy oil at $80/barrel (hedging instrument)
- At reporting date: oil price has risen to $90/barrel → Forward contract has a fair value of $10,000,000 gain (effective)

**At Reporting Date:**

```
Recognize effective portion in OCI:
Dr  Forward Contract (Asset)      10,000,000
    Cr  Cash Flow Hedge Reserve (OCI)          10,000,000
```

**When Oil is Purchased (6 months later):**
Assume oil price at settlement = $88/barrel. Actual gain on forward = $8,000,000.

```
Settle forward contract:
Dr  Cash                           8,000,000
    Cr  Forward Contract (Asset)               8,000,000
        (plus adjustment for change in FV since reporting date)

Recognize oil inventory (hedged item):
Dr  Inventory (Oil)               88,000,000   ← at spot price
    Cr  Cash                                  88,000,000

Reclassify OCI to reduce cost of inventory (basis adjustment):
Dr  Cash Flow Hedge Reserve (OCI)  8,000,000
    Cr  Inventory (Oil)                        8,000,000

Net: Inventory carried at R80,000,000 (locked-in forward price)
```

**Economic result**: Sasol effectively paid $80/barrel regardless of market movements — the hedge accounting reflects this.

---

## Type 3: Net Investment Hedge

### Objective

To hedge the foreign currency exposure arising from a net investment in a foreign operation (subsidiary, associate, JV, branch).

### Accounting Treatment

| Component | Treatment |
|-----------|-----------|
| **Effective portion** of gain/loss on hedging instrument | **OCI** (translation reserve) |
| **Ineffective portion** | **P/L** |
| On disposal of the foreign operation | **Reclassify** cumulative OCI to P/L |

### Hedging Instruments

Uniquely, both **derivative** and **non-derivative** instruments can be used as hedging instruments for net investment hedges. A common real-world example is using a foreign currency **borrowing** (non-derivative) to hedge the FX exposure on a foreign subsidiary.

**Example:**
- Naspers has a USD subsidiary with net assets of $50,000,000
- Naspers has USD borrowings of $30,000,000 designated as a net investment hedge
- If ZAR weakens against USD: the USD subsidiary's net assets increase in ZAR (gain in OCI under IAS 21); the USD borrowing also increases in ZAR (loss) — but this loss goes to OCI (instead of P/L) under the hedge

---

## Discontinuation of Hedge Accounting

IAS 39 requires hedge accounting to be discontinued when:

| Reason | Effect |
|--------|--------|
| Hedging instrument expires, is sold, terminated, or exercised | Prospective discontinuation |
| Hedge no longer meets qualifying criteria (e.g., fails effectiveness test) | Prospective discontinuation |
| Forecast transaction is no longer highly probable | OCI balance reclassified to P/L immediately |
| Entity revokes the designation (voluntary) | Prospective discontinuation |

On discontinuation of a **cash flow hedge**:
- If the hedged transaction is still expected to occur → cumulative OCI balance remains and is reclassified when the transaction affects P/L
- If the hedged transaction is NO LONGER expected to occur → cumulative OCI balance reclassified to P/L **immediately**

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Applying hedge accounting without documentation at inception | Documentation must exist at the START — not retroactively |
| Putting the ineffective portion into OCI | Ineffective portion always goes to P/L immediately |
| Forgetting that fair value hedge adjusts the hedged item's carrying amount | The hedged item (e.g., bond at amortised cost) gets adjusted for hedge-attributable FV changes |
| Confusing cash flow and fair value hedges | Fixed rate exposure → fair value hedge. Variable / forecast → cash flow hedge |
| Recycling the OCI balance when hedged forecast transaction is still probable | Only recycle when the transaction affects P/L (or if no longer probable → recycle immediately) |
| Ignoring the 80–125% effectiveness test in IAS 39 questions | Always calculate the ratio; conclude on whether hedge accounting continues |

---

## Exam Technique

### Identifying the Type of Hedge

- Is the hedged item a **recognized asset/liability or firm commitment**? → Fair value hedge
- Is the hedged item a **forecast transaction or variable rate item**? → Cash flow hedge
- Is the hedged item a **net investment in a foreign operation**? → Net investment hedge

### For Cash Flow Hedge Questions

1. Determine the effective and ineffective portions
2. Effective → OCI; Ineffective → P/L
3. Reclassify OCI to P/L when the hedged item affects P/L
4. Show cumulative OCI balance (hedge reserve) movement

### Mark Allocation Tip

For a 12-mark hedge accounting question:
- Identify type of hedge with justification: 2 marks
- Check qualifying criteria: 2 marks
- Effectiveness assessment (80–125%): 2 marks
- Journal entries for each period: 4 marks
- Discontinuation treatment (if applicable): 2 marks

---

## Key Takeaways

1. **Hedge accounting** prevents artificial P/L volatility by matching gains/losses on the hedging instrument with the hedged item
2. **IAS 39 has three hedge types**: fair value, cash flow, net investment
3. **Six criteria** must all be met — documentation at inception is non-negotiable
4. **The 80–125% effectiveness test** is IAS 39's quantitative threshold — failing it means losing hedge accounting
5. **Fair value hedges**: both the derivative and the hedged item are adjusted through P/L → they cancel
6. **Cash flow hedges**: effective portion in OCI; reclassified to P/L when the hedged cash flow affects P/L
7. **Net investment hedges**: effective portion in OCI (translation reserve); recycled on disposal of foreign operation

---

**← Previous: Part 6 — Impairment: The ECL Model**

**Next: Part 8 — Hedge Accounting: IFRS 9 Framework →**
