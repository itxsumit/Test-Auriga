# Architectural Reasoning & Design Document — GiftPool

## 1. Domain Problem Formulation

Organizing collaborative collections (e.g., farewell gifts, shared office pools, group events) routinely leads to three core operational frictions:
1. **Dynamic Target Headcount:** As members are onboarded or drop out, calculating the individual obligation manually causes confusion and rounding discrepancies.
2. **Unequal Contributions & Friend Covers:** Members contribute varying amounts—some pay their exact share, others pay surplus amounts to cover friends, and some contribute nothing initially.
3. **Circular / Excessive Settlements:** When calculating reimbursements, naive approaches produce high transaction counts and confusing circular payment loops (e.g., A pays B, B pays C, C pays A).

GiftPool formalizes this as an equitable zero-sum ledger system that tracks continuous parity and generates minimal peer-to-peer settlement plans.

---

## 2. Core Mathematical Logic & Parity Engine

### 2.1 Fair Share Formulation
Given a target pool budget $T$ and active participant count $N$:
$$\text{Fair Share} = \left\lceil \frac{T}{N} \right\rceil \quad (\text{or integer ceiling division to prevent fractional debt deficits})$$

### 2.2 Individual Net Balance
For each participant $i$ who has paid cumulative amount $P_i$:
$$\text{Balance}_i = P_i - \text{Fair Share}$$

* **$\text{Balance}_i > 0$ (Creditor):** The participant paid more than their obligation and is owed money back.
* **$\text{Balance}_i < 0$ (Debtor):** The participant paid less than their obligation and owes money into the pool.
* **$\text{Balance}_i = 0$ (Settled):** The participant's contribution matches their fair share exactly.

### 2.3 System Invariant (Zero-Sum Conservation)
$$\sum_{i=1}^{N} \text{Balance}_i = \sum_{i=1}^{N} P_i - N \times \text{Fair Share}$$
When the pool is fully funded ($\sum P_i = T$), the system satisfies exact zero-sum equilibrium:
$$\sum_{i=1}^{N} \text{Balance}_i = 0$$

---

## 3. Minimal Transaction Settlement Algorithm

To eliminate circular payments and minimize the total number of peer-to-peer cash transfers, GiftPool implements a **Greedy Two-Pointer Settlement Engine**.

### 3.1 Algorithmic Steps
1. **Partitioning:** Separate participants into two disjoint queues:
   - **Debtors ($D$):** Participants where $\text{Balance} < 0$.
   - **Creditors ($C$):** Participants where $\text{Balance} > 0$.
2. **Sorting:** Sort both lists in descending order of magnitude:
   - Max debtor first (greatest debt amount).
   - Max creditor first (greatest surplus amount).
3. **Greedy Matching:**
   - Let $d \in D$ owe $|B_d|$ and $c \in C$ be owed $B_c$.
   - Settle amount $M = \min(|B_d|, B_c)$.
   - Record transfer: `$d$ pays $c$ ₹$M$`.
   - Update balances:
     $$|B_d| \leftarrow |B_d| - M, \quad B_c \leftarrow B_c - M$$
   - Remove whichever party reaches $0$ balance and advance the pointer.
4. **Termination:** Continues until both lists are exhausted.

### 3.2 Complexity Analysis
- **Time Complexity:** $O(N \log N)$ driven by the sort operation, followed by $O(N)$ linear matching.
- **Space Complexity:** $O(N)$ auxiliary memory for debtor and creditor balance tracking.
- **Optimality:** Produces at most $N - 1$ transactions, strictly eliminating cyclic debt chains.

---

## 4. Architectural Decisions & Tradeoffs

1. **Server-Side State & Logic (Spring Boot):**
   - Settlement calculation and ledger balance updates are executed centrally in the Java service layer to ensure atomic consistency and prevent race conditions or client-side tampering.
2. **Lightweight Modern Client (Tailwind CSS + ES6):**
   - A single-page architecture avoids heavy frontend framework overhead, enabling instant sub-millisecond DOM updates and clear visual reporting.
3. **Extensibility for Multi-Tenancy:**
   - Domain models are decoupled from hardcoded parameters, allowing runtime adjustment of pool budgets, event titles, and dynamic participant rosters.