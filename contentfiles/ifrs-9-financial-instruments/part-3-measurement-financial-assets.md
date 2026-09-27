# IFRS 9 Financial Instruments — Part 3: Measurement of Financial Assets

## The Measurement Hierarchy

Once a financial asset is classified (Part 2), measurement follows logically from that classification. There are two stages to consider:

1. **Initial measurement** — what do you record when you first recognize the asset?
2. **Subsequent measurement** — how do you carry it on your books each reporting period?

---

## Initial Measurement (IFRS 9.5.1)

### The General Rule

All financial assets are initially measured at **fair value**.

However, what happens to transaction costs depends on the classification:

| Classification | Transaction Costs | Initial Amount |
|----------------|-------------------|---------------|
| FVTPL | Expensed immediately in P/L | Fair value only |
| Amortised Cost | Added to initial amount | FV + transaction costs |
| FVOCI (Debt) | Added to initial amount | FV + transaction costs |
| FVOCI (Equity OCI option) | Added to initial amount | FV + transaction costs |

### What Are Transaction Costs?

Incremental costs directly attributable to the acquisition of a financial asset:
- Brokerage commissions and fees
- Transfer taxes
- Regulatory levies

**NOT** transaction costs (exclude):
- Finance costs (interest)
- Internal administrative costs
- Debt premium/discount

### Fair Value at Initial Recognition

In most cases, the fair value at initial recognition equals the **transaction price** (what you paid). However, if the transaction price differs from fair value — most commonly with a **below-market-rate loan** — the difference must be recognized:

**Example: Below-Market Loan**
A parent company lends R1,000,000 to its subsidiary at 0% interest when market rate is 10% for 3 years.

Fair value of the loan at inception:
PV of R1,000,000 in 3 years @ 10% = R1,000,000 × 0.7513148 = R751,314.80

| | Dr | Cr |
|--|--|--|
| Loan Receivable | 751,314.80 | |
| Equity (capital contribution to subsidiary) | 248,685.20 | |
| Cash | | 1,000,000.00 |

The discount (R248,685.20) is the economic substance of the benefit given to the subsidiary — recognized as an equity contribution or expense depending on the relationship.

---

## Subsequent Measurement: Amortised Cost

### The Core Concept

An asset measured at amortised cost is carried at:

```
Amortised Cost = Initial Amount
                 + Cumulative interest income (EIR method)
                 - Cash received
                 ± Amortisation of premium/discount
                 - Impairment losses
```

### The Effective Interest Rate (EIR) Method

> The EIR method is the single most frequently examined calculation in financial instruments. If you can build an amortisation table accurately under time pressure, you are well-positioned for any measurement question.

The EIR is the rate that **exactly discounts** all estimated future cash flows back to the gross carrying amount at initial recognition.

> Think of EIR as the internal rate of return of the instrument — the rate that makes the present value of all inflows equal to the carrying amount.

**Why not just use the coupon rate?**

The coupon rate is applied to the *face value* (par). But if you paid a *premium* or *discount* to acquire the asset (i.e., not at par), the coupon rate understates or overstates your true return. The EIR corrects for this by spreading the premium/discount over the life of the instrument.

### Worked Example: Bond at a Discount

**Facts:**
- 3-year bond, face value R1,000,000, coupon rate 8% p.a. (paid annually)
- Purchased for R950,262.96 (at a discount, because market rate = 10%)
- Transaction costs: nil

**EIR Calculation:**
EIR = 10% (the market rate that gives a PV of R950,262.96 for the cash flows)

Cash flows:
- Year 1: R80,000 coupon
- Year 2: R80,000 coupon
- Year 3: R80,000 coupon + R1,000,000 principal = R1,080,000

PV @ 10%: R80,000 × 2.4868520 + R1,000,000 × 0.7513148 = R198,948.16 + R751,314.80 = R950,262.96 ✓

(Using the annuity factor for the three annual coupons, plus the single-sum PV factor for the R1,000,000 principal repayment at maturity. Do not add the Year 3 coupon into the principal — the annuity factor already captures all three coupons.)

**Amortisation Table:**

| Year | Opening Balance | Interest @ 10% (EIR) | Coupon Received @ 8% | Closing Balance |
|------|----------------|---------------------|---------------------|----------------|
| 1 | 950,262.96 | 95,026.30 | (80,000.00) | 965,289.26 |
| 2 | 965,289.26 | 96,528.93 | (80,000.00) | 981,818.19 |
| 3 | 981,818.19 | 98,181.81 | (80,000.00) | 1,000,000.00 |
| 3 | 1,000,000.00 | — | (1,000,000.00) | 0.00 |

**Journal entries — Year 1:**

```
Cash received (coupon):
Dr  Cash                              80,000.00
    Cr  Interest Income                           80,000.00

Interest income (EIR accrual — discount amortisation):
Dr  Financial Asset — Bond            15,026.30
    Cr  Interest Income                           15,026.30

Total interest income Year 1 = R95,026.30
```

The key insight: you received only R80,000 in cash, but your true return was R95,026.30. The extra R15,026.30 represents the discount being amortised — your carrying amount increases toward face value over time.

---

## Subsequent Measurement: FVOCI (Debt Instruments)

### The Mechanics

For debt instruments at FVOCI:
- **Interest income**: Recognized in P/L using the EIR method (same as amortised cost)
- **Impairment losses**: Recognized in P/L (same as amortised cost)
- **Foreign exchange gains/losses** on the amortised cost portion: in P/L
- **Fair value changes** (the remainder): in **OCI**

On **derecognition** (sale), the cumulative OCI gain/loss is **recycled to P/L**.

### Why Is It Called "FVOCI" if Interest Goes to P/L?

The *carrying amount* on the balance sheet is fair value. But the P/L treatment mirrors amortised cost — interest income, impairment, and FX go to P/L. Only the *residual* fair value movement (market price fluctuation beyond what the EIR model captures) goes to OCI.

### Worked Example: FVOCI Debt Instrument

**Facts (continuing from above):**
- Same bond, but classified FVOCI (hold to collect & sell)
- End of Year 1: Market price of bond = R980,000 (fair value)
- Carrying amount at amortised cost end Year 1 = R965,289.26

**Year 1 Entries:**

```
Interest income (EIR method — same as amortised cost):
Dr  Financial Asset — Bond (amortised cost basis)   15,026.30
Dr  Cash                                            80,000.00
    Cr  Interest Income (P/L)                                  95,026.30

Fair value adjustment (to bring to FV of R980,000):
FV = R980,000.00; Amortised cost carrying amount = R965,289.26
OCI adjustment needed = R980,000.00 − R965,289.26 = R14,710.74

Dr  Financial Asset — Bond                          14,710.74
    Cr  OCI (Fair Value Reserve)                               14,710.74
```

**Statement of Financial Position:**
Bond carried at R980,000 (fair value) ✓

**P/L impact**: R95,026.30 interest income only
**OCI impact**: R14,710.74 fair value gain

---

## Subsequent Measurement: FVOCI (Equity Instruments — OCI Option)

### Key Differences from FVOCI Debt

| Feature | FVOCI Debt | FVOCI Equity |
|---------|------------|-------------|
| Interest in P/L | ✓ Yes (EIR) | ✗ No |
| Dividends in P/L | ✗ No | ✓ Yes (usually) |
| Impairment model | ✓ Yes | ✗ No |
| Recycling on derecognition | ✓ Yes | ✗ Never |
| OCI balance on sale | → P/L | → Retained earnings |

### Dividends Under the Equity OCI Option

Dividends from FVOCI equity investments are recognized in P/L **unless** the dividend clearly represents a recovery of part of the cost of the investment (e.g., a liquidating dividend or return of capital).

### Worked Example: FVOCI Equity

**Facts:**
- Entity purchases 100,000 shares in JSE-listed Growthpoint at R25/share (R2,500,000 total)
- Transaction costs: R50,000 (added to initial carrying amount → R2,550,000)
- Entity irrevocably designates as FVOCI equity at inception
- End of year: Share price = R28/share → Fair value = R2,800,000
- Dividend received during year: R150,000

**Journal Entries:**

```
Initial recognition:
Dr  Financial Asset — Growthpoint   2,550,000
    Cr  Cash                                    2,550,000

Dividend received:
Dr  Cash                              150,000
    Cr  Dividend Income (P/L)                     150,000

Fair value adjustment at year end:
FV = R2,800,000; Carrying amount = R2,550,000; Gain = R250,000
Dr  Financial Asset — Growthpoint     250,000
    Cr  OCI (FV Reserve — Equity)                 250,000
```

**If shares are subsequently sold for R2,900,000:**

```
Dr  Cash                            2,900,000
    Cr  Financial Asset — Growthpoint            2,800,000
    Cr  OCI (FV Reserve — Equity)                  100,000  ← gain on sale
```

The cumulative OCI balance (now R350,000: R250,000 unrealized + R100,000 from sale) **transfers to retained earnings**, not to P/L. The gain on sale is **never seen in P/L**.

> [!WARNING]
> Under IAS 39, selling an AFS equity investment WOULD have recycled gains to P/L. Under IFRS 9's equity OCI option, these gains are permanently locked out of P/L. This is a critical exam distinction.

---

## Subsequent Measurement: FVTPL

### The Simplest Category

Assets at FVTPL are measured at **fair value** at each reporting date. All changes — gains, losses, interest, dividends — go through **profit or loss**.

```
Dr / Cr  Financial Asset         (FV change)
         Cr / Dr  Fair Value Gain/Loss (P/L)
```

Transaction costs are expensed immediately — they do not form part of the carrying amount.

### Why Would an Entity Choose FVTPL (via FVO)?

If holding an asset at amortised cost would create a measurement mismatch with a related liability measured at fair value, the FVO at FVTPL eliminates that mismatch. This is an accounting policy choice made irrevocably at inception.

---

## Reclassification Between Categories

Reclassification is only permitted when the entity **changes its business model** — an expected to be very rare event.

| From → To | Treatment on Reclassification Date |
|-----------|-----------------------------------|
| AC → FVTPL | Measure at FV; difference to P/L |
| AC → FVOCI | Measure at FV; difference to OCI |
| FVTPL → AC | FV at reclassification becomes new gross carrying amount; EIR calculated from that date |
| FVTPL → FVOCI | FV at reclassification becomes new carrying amount; EIR calculated from that date |
| FVOCI → AC | Cumulative OCI gain/loss removed from OCI and adjusted against gross carrying amount; no P/L impact |
| FVOCI → FVTPL | Cumulative OCI gain/loss reclassified to P/L at reclassification date |

---

## Comprehensive Example: Multi-Asset Portfolio Measurement

**Facts:**
Entity holds the following at 1 January 20X1:

| Asset | Classification | Carrying Amount | Year-End FV | Cash Received |
|-------|---------------|----------------|-------------|---------------|
| Trade receivable | Amortised Cost | R500,000 | N/A | R500,000 collected |
| Corporate bond | FVOCI (Debt) | R800,000 | R820,000 | R60,000 interest (coupon) |
| Investment in BHP shares | FVTPL | R1,200,000 | R1,050,000 | R30,000 dividend |
| Investment in Sanlam shares | FVOCI (Equity OCI) | R600,000 | R650,000 | R20,000 dividend |

**Year-End Measurement:**

*Trade receivable:*
- Collected in full → derecognized. No measurement issue.

*Corporate bond (FVOCI Debt):*
- Assume EIR method generates interest income of R72,000
- Cash received: R60,000 coupon
- Amortised cost carrying amount: R800,000 + R72,000 − R60,000 = R812,000
- FV = R820,000; OCI adjustment = R820,000 − R812,000 = R8,000
- P/L: R72,000 interest income
- OCI: R8,000 gain

*BHP shares (FVTPL):*
- FV decline: R1,200,000 → R1,050,000 = R150,000 loss
- P/L: R30,000 dividend income; R(150,000) FV loss = net R(120,000)

*Sanlam shares (FVOCI Equity):*
- FV gain: R650,000 − R600,000 = R50,000
- P/L: R20,000 dividend income
- OCI: R50,000 gain (never recycled)

**Summary of Year-End P/L Impact:**

| Item | P/L |
|------|-----|
| Bond interest income | +72,000 |
| BHP dividend | +30,000 |
| BHP FV loss | (150,000) |
| Sanlam dividend | +20,000 |
| **Net P/L** | **(28,000)** |

**OCI Impact:**

| Item | OCI |
|------|-----|
| Bond FV gain | +8,000 |
| Sanlam shares FV gain | +50,000 |
| **Total OCI** | **58,000** |

---

## Common Student Pitfalls

| Pitfall | Correct Approach |
|---------|------------------|
| Adding transaction costs to FVTPL assets | Transaction costs for FVTPL assets are expensed immediately |
| Using coupon rate instead of EIR for interest income | Always use the EIR — it's the rate that amortises premium/discount |
| Recycling FVOCI equity OCI gains to P/L on sale | Equity OCI gains transfer to retained earnings — never P/L |
| Forgetting that impairment applies to FVOCI debt but NOT FVOCI equity | Impairment model (ECL — see Part 6) applies to amortised cost AND FVOCI debt instruments |
| Treating all FV changes on FVOCI as going to P/L | Only interest (EIR), impairment, and FX on amortised cost go to P/L for FVOCI debt |

---

## Exam Technique

### "Prepare the Journal Entries" Questions

1. **Identify the classification** first (from Part 2 work)
2. **Initial measurement**: FV ± transaction costs (as applicable)
3. **Interest income**: Always EIR method for AC and FVOCI debt
4. **Fair value movement**: Determine P/L vs OCI based on category
5. **Dividends**: P/L for FVTPL and FVOCI equity (unless return of capital)
6. **Impairment**: P/L for AC and FVOCI debt (covered in Part 6)

### Mark Allocation Tip

For amortised cost questions, always present the **amortisation table** clearly — it shows the examiner your methodology and earns process marks even if you make an arithmetic error.

---

## Key Takeaways

1. **All financial assets** are initially recognized at **fair value**; transaction costs added except for FVTPL
2. **Amortised Cost**: EIR method for interest; changes in carrying amount through P/L
3. **FVOCI Debt**: Same interest and impairment treatment as amortised cost in P/L; only residual FV changes go to OCI; recycled on derecognition
4. **FVOCI Equity**: Dividends to P/L; all FV changes to OCI; OCI balance NEVER recycled to P/L
5. **FVTPL**: Everything (FV changes, interest, dividends) goes to P/L
6. **Reclassification** only on genuine business model change; applied prospectively

---

**← Previous: Part 2 — Classification of Financial Assets**

**Next: Part 4 — Financial Liabilities →**
