# IFRS 9 Financial Instruments — Part 1: Scope & Introduction

## The Problem That Created IFRS 9

To understand IFRS 9, you first need to understand why it was needed.

The 2008 global financial crisis exposed a fundamental flaw in the prevailing standard at the time — **IAS 39 Financial Instruments: Recognition and Measurement**. Banks and financial institutions were carrying loans on their books at full value right up until the moment borrowers defaulted. The accounting only recognized losses *after* they had occurred. Regulators, investors, and standard-setters watched in horror as multi-billion-rand write-downs appeared seemingly overnight.

The G20 leaders called on the IASB to create a simpler, more forward-looking standard. The result was **IFRS 9**, developed in three phases and fully effective from **1 January 2018**.

> **The central shift**: IAS 39 was *backward-looking* (recognize losses when they happen). IFRS 9 is *forward-looking* (recognize losses before they happen).

---

## What is a Financial Instrument?

Before we can classify or measure anything, we need to understand what we're dealing with.

### Definition (IAS 32.11)

> A **financial instrument** is any contract that gives rise to a **financial asset** of one entity and a **financial liability or equity instrument** of another entity.

This is a two-sided definition — for every financial instrument, there are two parties.

### Financial Asset (IAS 32.11)

A financial asset is any asset that is:

| Type | Example |
|------|---------|
| Cash | Bank balance |
| An equity instrument of another entity | Shares held in JSE-listed company |
| A contractual right to receive cash or another financial asset | Trade receivable, loan given |
| A contractual right to exchange financial instruments under potentially favourable conditions | Call option held |

### Financial Liability (IAS 32.11)

A financial liability is any liability that is:

| Type | Example |
|------|---------|
| A contractual obligation to deliver cash or another financial asset | Trade payable, bond issued, loan received |
| A contractual obligation to exchange financial instruments under potentially unfavourable conditions | Written put option |

### Equity Instrument (IAS 32.11)

Any contract that evidences a residual interest in the assets of an entity after deducting all of its liabilities.

> [!IMPORTANT]
> **The distinction matters enormously.** Whether an instrument is classified as a financial liability or equity under IAS 32 determines where interest/dividends go (P/L vs equity) and whether it appears in leverage ratios. This distinction is governed by **IAS 32**, not IFRS 9. IFRS 9 deals with *how* you measure once IAS 32 has determined *what* it is.

---

## What Falls WITHIN the Scope of IFRS 9?

IFRS 9 applies to **all financial instruments** *except* those specifically excluded.

This means it covers:
- Trade receivables and payables
- Loans and borrowings
- Investments in shares and bonds
- Derivative instruments (forwards, options, swaps)
- Lease receivables (the lessor side under IFRS 16)
- Financial guarantee contracts
- Loan commitments (in some cases)

---

## What Falls OUTSIDE the Scope of IFRS 9?

| Excluded Item | Standard That Applies |
|---------------|----------------------|
| Interests in subsidiaries, associates, and joint ventures | IFRS 10, IAS 27, IAS 28 |
| Rights and obligations under leases (lessee) | IFRS 16 |
| Employers' rights and obligations under employee benefit plans | IAS 19 |
| Insurance contracts (issued) | IFRS 17 |
| Share-based payment instruments | IFRS 2 |
| Equity instruments issued by the entity itself | IAS 32 |

> [!CAUTION]
> **Common exam trap**: Investments in subsidiaries, associates, and JVs are scoped *out* of IFRS 9 in the *consolidated* financial statements. However, in the *separate* financial statements of a parent or investor, these investments ARE within scope — they can be measured at cost, fair value (IFRS 9), or the equity method.

---

## The Three Phases of IFRS 9

The IASB developed IFRS 9 in three distinct phases, each addressing a different deficiency in IAS 39:

| Phase | Topic | The Problem with IAS 39 |
|-------|-------|-------------------------|
| **Phase 1** | Classification & Measurement | Too many categories (4), arbitrary classification, "tainting rules" |
| **Phase 2** | Impairment | Losses recognized too late (incurred loss model) |
| **Phase 3** | Hedge Accounting | Too rules-based, many legitimate economic hedges couldn't qualify |

Each phase is covered in detail in the subsequent parts of this guide.

---

## IAS 39 vs IFRS 9: A Summary Overview

It is essential for exam purposes to understand *both* standards and how they compare. Many exam questions are set in a transition context, or require you to explain why a particular treatment differs.

| Feature | IAS 39 | IFRS 9 |
|---------|--------|--------|
| **Financial asset categories** | 4 categories | 3 categories |
| **Classification basis** | Management intention + rules | Business model + cash flow characteristics |
| **Impairment model** | Incurred loss | Expected credit loss (ECL) |
| **Hedge effectiveness test** | Quantitative: 80–125% | Principles-based: economic relationship |
| **Own credit risk on FVO liabilities** | Changes in P/L | Changes in OCI |
| **Complexity** | High — many exceptions and carve-outs | Lower — principles-based |

---

## IFRS 9 Transition: What You Need to Know

When IFRS 9 became effective (1 January 2018), entities transitioning from IAS 39 had to apply specific transition rules:

**Classification & Measurement:**
- Classification of financial assets is assessed based on the facts and circumstances at the **date of initial application** (not retrospectively at each asset's original recognition date)
- An entity may designate or revoke prior FVO designations at the transition date
- Comparative periods **need not be restated** — the entity applies IFRS 9 prospectively from the transition date, with any adjustment recognized in opening retained earnings

**Impairment:**
- The ECL model applies from the date of initial application
- The entity must determine the stage of each financial asset by comparing credit risk at origination with credit risk at the transition date — without the benefit of hindsight
- This was particularly challenging for South African banks with large loan books originated years before transition

**Hedge Accounting:**
- Entities may make an irrevocable election to continue applying **IAS 39 hedge accounting** instead of IFRS 9 hedge accounting — and many SA entities with complex macro hedge programmes chose to do so
- If transitioning to IFRS 9 hedge accounting, qualifying hedges can be carried forward without discontinuation

> [!NOTE]
> Exam questions may test transition — typically by asking how a specific asset's classification changes from IAS 39 to IFRS 9, or how the opening ECL allowance is determined. Know the principle: assess at the transition date, adjust opening retained earnings, no restatement of comparatives.

---

## Key Definitions You Must Know

| Term | Definition |
|------|------------|
| **Amortised cost** | Initial amount ± principal repayments ± cumulative amortisation of premium/discount ± impairment loss |
| **Effective interest rate (EIR)** | The rate that exactly discounts future cash flows to the gross carrying amount |
| **Fair value** | Price received to sell an asset or paid to transfer a liability in an orderly transaction between market participants (IFRS 13) |
| **Business model** | How an entity manages financial assets to generate cash flows |
| **SPPI** | Solely Payments of Principal and Interest — the cash flow characteristic test |
| **Credit loss** | Difference between contractual cash flows and expected cash flows, discounted at EIR |
| **Expected credit loss (ECL)** | Probability-weighted estimate of credit losses |
| **12-month ECL** | ECL from default events possible within 12 months |
| **Lifetime ECL** | ECL from all possible default events over the life of the instrument |
| **Significant increase in credit risk (SICR)** | The trigger for moving from 12-month to lifetime ECL |

---

## The Structure of IFRS 9

```
IFRS 9
├── Chapter 2: Recognition and Derecognition
├── Chapter 3: Classification
│   ├── 3.1 Financial Assets
│   └── 3.2 Financial Liabilities
├── Chapter 4: Measurement
│   ├── 4.1 Initial Measurement
│   ├── 4.2 Subsequent Measurement — Financial Assets
│   ├── 4.3 Subsequent Measurement — Financial Liabilities
│   └── 4.4 Impairment
└── Chapter 6: Hedge Accounting
```

> [!NOTE]
> There is no Chapter 5 in IFRS 9. The numbering jumps from Chapter 4 to Chapter 6. This is not an error — it was a deliberate decision by the IASB to allow for potential future chapters.

---

## Common Student Pitfalls

| Pitfall | How to Avoid |
|---------|--------------|
| Mixing up IAS 32, IAS 39, IFRS 9, and IFRS 7 | IAS 32 = presentation (what is it?). IFRS 9 = recognition & measurement. IFRS 7 = disclosures. IAS 39 = old measurement standard (now superseded) |
| Forgetting that IFRS 9 has a scope | Always check whether the instrument is in scope before applying IFRS 9 |
| Assuming IAS 39 is irrelevant | IAS 39 is still examinable and some entities continue to apply IAS 39 hedge accounting under the IFRS 9 transition provisions |
| Confusing financial instruments with physical commodities | A forward to buy gold is a financial instrument (derivative); gold itself is not |

---

## Worked Example: Is This a Financial Instrument?

**Facts:**
Consider the following items in a company's records:

| Item | Financial Instrument? | Reasoning |
|------|-----------------------|-----------|
| Trade receivable of R500,000 from a customer on 30-day credit | ✓ **Yes** — financial asset | A *contract* exists (the sale agreement). It gives rise to a right to receive cash (financial asset for the seller) and an obligation to pay cash (financial liability for the customer). |
| Inventory of 10,000 bags of maize held in a warehouse | ✗ **No** | No contractual right to receive cash or another financial instrument. Maize is a physical asset — accounted for under IAS 2. |
| A forward contract to buy USD 1,000,000 in 90 days at a fixed ZAR rate | ✓ **Yes** — derivative | A contract that will be settled net or by exchange of financial instruments. Both parties have contractual rights and obligations. |
| A provision for site rehabilitation at a mining operation | ✗ **No** | This is a constructive or legal obligation, but not a *contractual* obligation to deliver cash or another financial instrument. It falls under IAS 37. |
| Ordinary shares issued by the entity itself | ✗ **Not for the issuer** | From the *issuer's* perspective, its own equity instruments are scoped out of IFRS 9. From an *investor's* perspective, those shares are a financial asset. |

The key test every time: **is there a contract that creates a financial asset in one entity and a financial liability or equity instrument in another?** If the answer is no — stop. It's not a financial instrument.

---

## Exam Technique

### "Identify and Classify" Questions

These questions typically give you a list of items and ask whether they are financial instruments, and if so, what type. If you can apply the table above from memory, these are straightforward marks.

**Framework:**
1. Does a *contract* exist? (Financial instruments are contractual)
2. Does it give rise to a financial asset *and* a corresponding financial liability/equity instrument?
3. If yes — it's a financial instrument. Identify which side you're looking at (asset, liability, or equity).
4. Apply scope exclusions — is it covered by another standard?

### Mark Allocation Tip

For a "is this a financial instrument?" question worth 2 marks:
- 1 mark: State the definition or relevant criterion
- 1 mark: Apply and conclude

---

## Key Takeaways

1. **IFRS 9 replaced IAS 39** to address the failures exposed by the 2008 financial crisis
2. **A financial instrument** is a contract that creates a financial asset in one entity and a financial liability or equity in another
3. **IFRS 9 applies broadly** to all financial instruments except those explicitly scoped out
4. **Three phases**: classification & measurement, impairment, hedge accounting
5. **IAS 32** governs presentation (liability vs equity); **IFRS 9** governs measurement; **IFRS 7** governs disclosures — these are three separate standards working together
6. The central philosophical shift: from **incurred loss** to **expected loss** thinking

---

**Next: Part 2 — Classification of Financial Assets →**
