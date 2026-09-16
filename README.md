# Test-Auriga
# GiftPool — Intelligent Treasury & Settlement Engine

An enterprise-grade, lightweight collaborative treasury and expense settlement engine built using **Spring Boot** and a modern **Tailwind CSS** single-page frontend.

---

## Key Features

1. **Equitable Fair-Share Engine:**
   - Automatically computes equal contributions based on total goal target and active headcount.
   - Dynamically updates as new members are onboarded.

2. **Greedy Debt Minimization Algorithm ($O(N \log N)$):**
   - Resolves unequal chips, surplus contributors, and non-payers.
   - Calculates the minimum number of peer-to-peer settlement transactions using an optimal two-pointer greedy matching mechanism.

3. **Enterprise Fintech Dashboard:**
   - Real-time global metric tracking (Goal, Collected, Shortfall, Fair Share).
   - Individual balance ledger with instant positive/negative balance indicators.
   - Contributor receipt vouchers and automated transaction audit logs.

---

## Tech Stack

- **Backend:** Java 17+, Spring Boot (Web, REST API)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS
- **Build Tool:** Apache Maven

---

## Quick Start / Running Locally

### Prerequisites
- Java Development Kit (JDK 17 or higher)
- Apache Maven

### Execution Steps
1. Clone the repository:
   ```bash
   git clone [https://github.com/itxsumit/Test-Auriga.git](https://github.com/itxsumit/Test-Auriga.git)
   cd Test-Auriga