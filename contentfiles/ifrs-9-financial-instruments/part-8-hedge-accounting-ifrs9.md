# IFRS 9 Financial Instruments — Part 8: Hedge Accounting — IFRS 9 Framework

## What Changed and Why

IFRS 9's hedge accounting chapter (Chapter 6) was the third and final phase of the IFRS 9 project. The IASB's stated goal was to align hedge accounting more closely with entities' **actual risk management activities** — and to remove the arbitrary, rules-based constraints of IAS 39 that prevented many legitimate economic hedges from qualifying.

### The Core Philosophical Shift

| | IAS 39 | IFRS 9 |
|--|--------|--------|
| **Philosophy** | Rules-based | Principles-based |
| **Effectiveness test** | Quantitative: 80–125% | Qualitative: economic relationship |
| **Rebalancing** | Not permitted | Permitted (and required) |
| **Voluntary discontinuation** | Permitted | Not permitted (unless relationship ceases) |
| **Risk components** | Limited | Expanded |
| **Hedged items** | Narrower | Expanded (e.g., aggregated exposures) |
| **Disclosures** | IFRS 7 | Enhanced IFRS 7 requirements |

---

## IFRS 9 Qualifying Criteria

IFRS 9 retains the same three types of hedges (fair value, cash flow, net investment) and the same requirement for formal designation and documentation. However, the qualifying criteria are restructured and relaxed:

### Criterion 1: Formal Designation and Documentation

Same as IAS 39 — documentation must exist **at inception** and must cover:
- The hedging relationship (instrument + item + risk)
- The entity's risk management objective and strategy
- How the entity will assess whether the hedging relationship meets the effectiveness requirements

### Criterion 2: The Three Effectiveness Requirements (IFRS 9.6.4.1)

IAS 39's six criteria are replaced by three (plus the documentation requirement):

**Requirement (a): Economic Relationship**
There must be an economic relationship between the hedged item and the hedging instrument. This means that the hedging instrument and the hedged item have values that move in opposite directions because of the same risk.

> Under IAS 39 you had to *prove* effectiveness quantitatively. Under IFRS 9 you need to demonstrate that there is a *logical reason* why they should offset.

**Requirement (b): Credit Risk Does Not Dominate**
The effect of credit risk on the fair value of the hedging instrument or the hedged item should not be so large that it dominates the value changes resulting from the economic relationship.

If a highly credit-impaired counterparty wrote your derivative, the derivative's value would be driven primarily by the counterparty's credit risk, not by the hedged risk — the economic relationship breaks down.

**Requirement (c): Hedge Ratio**
The hedge ratio used in the designated hedging relationship must be the same as the one the entity actually uses for risk management purposes. An entity cannot designate an artificially high or low hedge ratio to achieve a desired accounting outcome.

---

## The IFRS 9 Effectiveness Assessment: No More 80–125%

This is the most significant practical change.

### Out: The 80–125% Quantitative Test

> This is where IAS 39 vs IFRS 9 comparison questions live. Know the five key differences (effectiveness test, rebalancing, voluntary discontinuation, risk components, cost of hedging) and you can score full marks on any comparison question.

IFRS 9 **abolishes the 80–125% rule**. There is no quantitative pass/fail threshold for hedge effectiveness.

### In: The Principles-Based Assessment

The entity must assess whether the hedging relationship meets the effectiveness requirements — specifically whether:
1. An economic relationship exists (qualitative)
2. Credit risk doesn't dominate (qualitative)
3. The hedge ratio aligns with actual risk management (quantitative — but not against a fixed threshold)

The assessment must be performed at inception and at each reporting date.

### Calculating Ineffectiveness

Even though there is no pass/fail test, **ineffectiveness is still calculated and recognized in P/L**. The method is the same as IAS 39 — the gain/loss on the hedging instrument that does not offset the gain/loss on the hedged item goes to P/L.

> [!IMPORTANT]
> Removing the 80–125% test does NOT mean that all ineffectiveness goes to OCI. Ineffectiveness still hits P/L — the change is that you no longer lose hedge accounting entirely if ineffectiveness is large. You simply recognize the ineffective portion in P/L and continue with hedge accounting.

---

## Rebalancing: The Key New Concept

### What is Rebalancing?

Under IAS 39, if a hedge started to become ineffective (e.g., because the entity hedged 100 tons of copper but only needs to hedge 80 tons now), the options were:
- Accept ineffectiveness and risk losing hedge accounting if it breaches 80–125%
- Voluntarily discontinue and re-designate — but this caused a discontinuity

IFRS 9 introduces **rebalancing**: when the hedge ratio needs adjustment to maintain alignment with actual risk management, the entity can adjust the designation (increase or decrease the quantity of the hedging instrument or hedged item) **without discontinuing** the hedge relationship.

### When is Rebalancing Required?

Rebalancing is required (not just permitted) when:
- The economic relationship still exists
- Credit risk doesn't dominate
- But the hedge ratio no longer reflects what the entity is actually doing for risk management

### How Rebalancing Works

**Increasing the hedged item** (or decreasing the hedging instrument):
- The additional quantity is treated as a new designation from the rebalancing date
- Previously accumulated OCI and basis adjustments are unaffected

**Decreasing the hedged item** (or increasing the hedging instrument):
- The removed portion is treated as a partial discontinuation
- Accumulated OCI relating to the discontinued portion is reclassified to P/L (or remains in OCI if the hedged item is still expected to occur)

> [!TIP]
> Think of rebalancing as "fine-tuning" the hedge designation to keep it aligned with reality, without starting over. This makes hedge accounting far more operationally practical than under IAS 39.

---

## Discontinuation Under IFRS 9

### Mandatory Discontinuation Only

A key change from IAS 39: under IFRS 9, **voluntary discontinuation of a qualifying hedge is NOT permitted**.

If the hedging relationship still meets all qualifying criteria, the entity must continue applying hedge accounting.

Discontinuation is only required when the qualifying criteria are no longer met — specifically when:
- The economic relationship no longer exists
- Credit risk has come to dominate
- The hedging instrument expires, is sold, terminated, or exercised
- The hedged item ceases to exist (or the forecast transaction is no longer highly probable)

### Why This Change?

Under IAS 39, some entities exploited voluntary discontinuation opportunistically — they would discontinue a hedge when it was advantageous to take the OCI gains to P/L, then re-designate. IFRS 9 closes this arbitrage.

---

## Expanded Eligibility: Risk Components

### The IAS 39 Limitation

Under IAS 39, only financial items could be designated in their entirety, or a specific risk component (e.g., the JIBAR component of interest rate risk). For **non-financial items** (commodities, etc.), only the total fair value change could be hedged — not a specific risk component.

**Example of the problem:**
A bakery wants to hedge only the wheat price risk in its bread input costs (not the processing cost, transport cost, etc.). Under IAS 39, it had to designate the full cost — making it impossible to achieve a clean hedge.

### IFRS 9 Expansion

IFRS 9 allows **separately identifiable and reliably measurable** risk components of **both financial and non-financial items** to be designated as hedged items.

This means the bakery can now designate:
- The wheat commodity price component of its bread input cost as the hedged item
- A wheat futures contract as the hedging instrument
- Without needing to worry about the non-wheat components

Similarly, an airline can hedge:
- The jet fuel price component of its ticket costs
- Using crude oil futures (even if the hedged item is jet fuel, not crude)

> [!NOTE]
> For non-financial risk components, the entity must demonstrate that the risk component is **separately identifiable** and **reliably measurable** — this is still a judgement call.

---

## Expanded Eligibility: Aggregated Exposures

IFRS 9 permits an **aggregated exposure** (a combination of an exposure and a derivative) to be designated as a hedged item.

**Example:**
- Entity has variable rate debt (floating rate risk)
- Enters into a receive-floating, pay-fixed swap to convert it to fixed rate (now a fair value hedge)
- Then wants to hedge the fair value of the combined "synthetic fixed rate debt" using another derivative

Under IAS 39, the synthetic instrument couldn't be designated as a hedged item. Under IFRS 9, this layered hedging strategy is permitted.

---

## Accounting Entries: Aligned with IAS 39

The **accounting entries** for the three hedge types under IFRS 9 are largely the same as IAS 39 (see Part 7). The key changes are in the *eligibility criteria* and *ongoing assessment*, not in how the entries are recorded.

| Hedge Type | Hedging Instrument | Hedged Item | Net P/L |
|-----------|-------------------|-------------|---------|
| Fair value | P/L (fair value) | P/L (basis adjustment) | Net to zero if perfect |
| Cash flow — effective | OCI | No entry until transaction occurs | Zero (until reclassification) |
| Cash flow — ineffective | P/L | No entry | Immediate P/L charge |
| Net investment — effective | OCI (translation reserve) | No separate entry | Zero until disposal |

---

## Costs of Hedging

### A New IFRS 9 Concept

When a hedging instrument has components that are excluded from the hedge designation (e.g., the time value of a purchased option, or forward points in a forward contract), IFRS 9 provides a specific treatment:

**Option Time Value:**
An entity may designate only the intrinsic value of an option as the hedging instrument, excluding its time value. The time value is then treated as a "cost of hedging":
- Recognized in OCI initially
- Reclassified to P/L systematically over the period the hedge relates to (for transaction-related hedged items) or when the hedged item affects P/L

**Forward Points:**
An entity may designate only the spot element of a forward contract as the hedging instrument. The forward points (the premium/discount) are treated similarly as a cost of hedging through OCI.

This treatment prevents the time value or forward points from creating unwanted P/L volatility, while still recognizing them as a cost of the hedging strategy over time.

---

## IAS 39 vs IFRS 9 Hedge Accounting: Comprehensive Comparison

| Feature | IAS 39 | IFRS 9 |
|---------|--------|--------|
| **Effectiveness test** | 80–125% quantitative | Economic relationship (qualitative) |
| **Rebalancing** | Not permitted | Permitted and required |
| **Voluntary discontinuation** | Permitted | Not permitted |
| **Non-financial risk components** | Cannot be designated alone | Can be designated if identifiable/measurable |
| **Aggregated exposures** | Cannot be hedged items | Can be hedged items |
| **Option time value** | Ineffectiveness if excluded from designation | Cost of hedging treatment (OCI) |
| **Forward points** | Ineffectiveness if excluded | Cost of hedging treatment (OCI) |
| **Written options as instruments** | Generally not permitted | Permitted in some circumstances |
| **Macro hedging** | Permitted (IAS 39.AG114–132) | Not yet addressed; IAS 39 may continue |

---

## Worked Example: IFRS 9 Cash Flow Hedge with Rebalancing

**Facts:**
- Impala Platinum expects to sell 10,000 oz of platinum in 3 months (highly probable)
- Enters into a forward contract to sell 10,000 oz at R18,000/oz
- At the next reporting date: expects to sell only 8,000 oz (revised forecast)
- The economic relationship still exists; credit risk is not dominant

**Rebalancing (reducing the hedged item):**
- The hedged item is reduced from 10,000 oz to 8,000 oz
- The 2,000 oz portion of the forward that no longer has a corresponding hedged item is discontinued
- Accumulated OCI for the 2,000 oz portion: assess whether forecast transaction for those oz is still expected → if NO → reclassify immediately to P/L; if YES → retain in OCI

```
Before rebalancing: 10,000 oz hedged; 10,000 oz forward designated
After rebalancing:   8,000 oz hedged; 8,000 oz forward designated
                     2,000 oz forward: assess OCI treatment on discontinuation
```

Under IAS 39, this would likely require full discontinuation and re-designation — creating a gap in hedge accounting. Under IFRS 9, rebalancing allows continuous hedge accounting with minimal disruption.

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Saying IFRS 9 has no effectiveness test | There is still an effectiveness assessment — just no 80–125% threshold |
| Forgetting that ineffectiveness still goes to P/L | Removing the 80–125% test doesn't eliminate P/L ineffectiveness |
| Applying voluntary discontinuation under IFRS 9 | IFRS 9 only allows mandatory discontinuation when criteria are no longer met |
| Assuming any risk component can be designated | Must be separately identifiable AND reliably measurable |
| Ignoring the cost of hedging treatment for time value | Option time value and forward points have a specific OCI deferral treatment |
| Treating rebalancing as discontinuation | Rebalancing is an adjustment to an ongoing hedge — not a stop and restart |

---

## Exam Technique

### IFRS 9 vs IAS 39 Comparison Questions

These are common at CTA level. Structure your answer as:

1. **Effectiveness**: IAS 39 = 80–125% (quantitative); IFRS 9 = economic relationship (qualitative)
2. **Rebalancing**: IAS 39 = not permitted; IFRS 9 = permitted/required
3. **Discontinuation**: IAS 39 = voluntary allowed; IFRS 9 = mandatory only
4. **Eligible items**: IFRS 9 = broader (risk components of non-financials, aggregated exposures)
5. **Cost of hedging**: IFRS 9 introduces specific OCI treatment for time value and forward points

### For Hedge Accounting Questions Generally

Always start by:
1. Identifying the type of hedge (fair value / cash flow / net investment)
2. Confirming qualifying criteria are met
3. Determining effective vs ineffective portions
4. Processing the journal entries in the correct accounts (OCI vs P/L)

### Mark Allocation Tip

An IFRS 9 vs IAS 39 comparison worth 10 marks typically allocates 2 marks per key difference — aim to identify at least 5 clear, explained differences.

---

## Key Takeaways

1. **IFRS 9 hedge accounting** is principles-based; IAS 39 was rules-based
2. **The 80–125% quantitative test is abolished** — replaced by a qualitative economic relationship assessment
3. **Ineffectiveness still hits P/L** — the change is that a hedge doesn't collapse if ineffectiveness is high
4. **Rebalancing** allows adjustment of hedge ratios without discontinuation — a major practical improvement
5. **Voluntary discontinuation is prohibited** — preventing opportunistic cherry-picking
6. **Risk components** of non-financial items can now be designated as hedged items
7. **Cost of hedging** (option time value, forward points) gets OCI deferral treatment, not immediate P/L
8. **Accounting entries** are largely unchanged from IAS 39; the improvements are in eligibility and assessment

---

**← Previous: Part 7 — Hedge Accounting: IAS 39 Framework**

**Next: Part 9 — Disclosures & Exam Strategy →**
