# TheCostHub Benchmarks & Unit Cost Dataset

[![CI Verification](https://github.com/thecosthub/thecosthub-benchmarks/actions/workflows/verify-benchmark.yml/badge.svg)](https://github.com/thecosthub/thecosthub-benchmarks/actions/workflows/verify-benchmark.yml)
[![Website: thecosthub.com](https://img.shields.io/badge/Website-thecosthub.com-06b6d4?style=flat&logo=safari)](https://thecosthub.com)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/Data_License-CC_BY--SA_4.0-10b981.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Code License: MIT](https://img.shields.io/badge/Code_License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/thecosthub/thecosthub-benchmarks/pulls)

> **The open, verifiable dataset and telemetry harness behind [TheCostHub.com](https://thecosthub.com)** — Empirical unit economics comparing autonomous AI agent pipelines against full-time employees and legacy SaaS software for enterprise knowledge work.

---

## 🎯 Why TheCostHub?

Most LLM benchmarks measure abstract capability (MMLU, HumanEval, SWE-bench). **TheCostHub measures business unit economics**:
- **Cost per unit ($/task)**: Prompt & completion tokens, tool API calls, human-in-the-loop fallback cost.
- **Human labor baseline**: Fully loaded hourly rates across **39+ global labor markets** (US, UK, Germany, India, Philippines, etc.) calibrated with statutory employer taxes and benefits.
- **Deterministic reproducibility**: Every benchmark metric published on the leaderboard traces directly to an immutable Git commit, execution log, and deterministic schema in this repository.

---

## 📂 Repository Structure

```
thecosthub-benchmarks/
├── tasks/                              # Verified task experiment definitions (YAML)
│   ├── invoice-extract.yaml            # Finance & AP: Invoice & receipt parsing
│   ├── support-tier1.yaml              # Customer Ops: Voice & chat tier-1 resolution
│   └── nda-redline.yaml                # Legal: Contract & NDA redlining against playbooks
├── schemas/                            # JSON validation schemas
│   └── task-schema.json                # Strict JSON Schema for benchmark definitions
├── scripts/                            # Verification & synchronization engines
│   ├── validate-schema.ts              # Schema syntax & format validation
│   ├── verify-benchmark.ts             # Deterministic formula checks & token telemetry
│   ├── sync-to-dynamodb.ts             # Automated DynamoDB production sync
│   └── generate_monthly_bundle.py      # Monthly data release packager (JSON/CSV/XLSX)
├── .github/
│   ├── workflows/
│   │   ├── verify-benchmark.yml        # PR check: schema validation & verification
│   │   ├── sync-to-dynamodb.yml        # Merge trigger: publishes verified tasks to prod
│   │   └── monthly-release.yml         # 1st-of-month cron: packages monthly data release
│   └── ISSUE_TEMPLATE/
│       ├── benchmark-request.md        # Template for requesting new benchmarks
│       └── benchmark-result.md         # Template for submitting verified results
├── package.json
└── README.md
```

---

## 🔄 How the CI/CD Data Pipeline Works

```
1. Contributor forks repo & adds tasks/<task-name>.yaml
   ↓
2. Pull Request opened
   ↓
3. GitHub Action (`verify-benchmark.yml`) triggers:
   ├── Validates YAML against schemas/task-schema.json
   ├── Verifies human baseline labor formula ((hourly/60) × minutes × burden)
   ├── Checks statistical sample size (n ≥ 10)
   ├── Checks Straight-Through Processing (STP) + Human Fallback parity
   └── Posts structured verification report on the PR
   ↓
4. Maintainer reviews & merges to `main`
   ↓
5. GitHub Action (`sync-to-dynamodb.yml`) runs on merge:
   ├── Ingests verified task data into production DynamoDB
   └── Leaderboard at thecosthub.com updates instantly
```

---

## 📋 Task YAML Schema Specification

Every task in the `tasks/` directory is defined in structured YAML:

```yaml
benchmark_id: invoice-extract
name: "Invoice & Receipt Data Extraction"
category: "Finance & AP"
description: >
  End-to-end unstructured multipage PDF table parsing, line-item matching
  against purchase orders, and automated GL ledger coding.
submitted_by: "@thecosthub"
experiment_date: "2026-08-30"

# AI Pipeline Telemetry
ai_pipeline:
  models:
    - gpt-4o-mini
    - layoutlm-v3
  cost_per_unit_usd: 0.0214
  prompt_tokens_avg: 1850
  completion_tokens_avg: 420
  latency_ms: 650
  p95_latency_ms: 820
  accuracy_score: 99.4          # %
  stp_rate: 99.4                # Straight-Through Processing %
  human_fallback_rate: 0.6      # Cases requiring human escalation %
  sample_size: 100

# Human Labor Baseline
human_baseline:
  role: "Accounts Payable Specialist"
  hourly_rate_usd: 34.00
  minutes_per_unit: 8.5
  source: "BLS Occupational Outlook 2026 - Bookkeeping & Auditing Clerks"

# Legacy SaaS Alternative
saas_baseline:
  name: "Kofax / ABBYY FlexiCapture"
  cost_per_unit_usd: 0.85
  pricing_model: "Per-page processing fee (enterprise tier)"

# Workload Simulator Config
volume_config:
  default: 5000
  min: 500
  max: 50000
  step: 500
  label: "Monthly Document Volume"
```

---

## 🚀 How to Submit a Benchmark

We welcome contributions from enterprise teams, AI startups, researchers, and developers!

1. Fork this repository: `https://github.com/thecosthub/thecosthub-benchmarks`
2. Create a branch: `git checkout -b task/my-benchmark-task`
3. Add your YAML definition under `tasks/<benchmark-id>.yaml`
4. Test locally:
   ```bash
   npm install
   npm run validate
   npm run verify
   ```
5. Open a Pull Request. Once approved, your data will appear on the live leaderboard at [thecosthub.com](https://thecosthub.com).

---

## 📊 Monthly Data Feed & Excel Financial Models

For CFOs, VP of Operations, and Enterprise Architects, we provide the **TheCostHub Monthly Unit Cost Index & Data Feed**:
- **Continuous Raw JSON/CSV Telemetry Dumps**
- **Excel (.xlsx) Labor vs AI Sensitivity Model** (with 39+ country labor calibrations)
- **Priority Custom Benchmark Execution Queue**

👉 Learn more at **[thecosthub.com/pricing](https://thecosthub.com/pricing)**

---

## 📄 Citation

If you use TheCostHub datasets or methodology in your research, whitepapers, or business presentations, please cite:

```bibtex
@misc{thecosthub2026,
  author = {TheCostHub Research Team},
  title = {TheCostHub: Empirical Knowledge Work Unit Economics & AI Labor Parity Index},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/thecosthub/thecosthub-benchmarks}},
  note = {Accessed: 2026-08-30}
}
```

---

## ⚖️ License

- **Data & Benchmark Results**: [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)
- **Code & Evaluation Harness**: [MIT License](https://opensource.org/licenses/MIT)
