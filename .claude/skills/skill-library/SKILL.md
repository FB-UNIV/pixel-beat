---
name: skill-library
description: Router for ECC LIBRARY-tier skills not loaded by default for pixel-beat (TypeScript/Express/Socket.io only) — search this when a task needs an off-stack language, framework, or domain skill.
---

# Skill library (pixel-beat)

pixel-beat is TypeScript + Express + Socket.io only, unbundled vanilla-JS
frontend, no tests/CI/Docker/database — see `.claude/CLAUDE.md` for the daily
surface. Everything below is installed via the global `ecc@ecc` plugin and
reachable by exact name with the Skill tool; it just isn't a default reach-for
on this repo. Invoke by name, e.g. `Skill({ skill: "react-patterns" })`.

## By keyword

**Other backend languages/frameworks** — python-patterns, python-testing,
django-patterns, django-tdd, django-security, django-verification, django-celery,
fastapi-patterns, golang-patterns, golang-testing, rust-patterns, rust-testing,
java-coding-standards, springboot-patterns, springboot-security, springboot-tdd,
springboot-verification, quarkus-patterns, quarkus-security, quarkus-tdd,
quarkus-verification, jpa-patterns, kotlin-patterns, kotlin-testing,
kotlin-coroutines-flows, kotlin-exposed-patterns, kotlin-ktor-patterns,
dotnet-patterns, csharp-testing, fsharp-testing, cpp-coding-standards,
cpp-testing, perl-patterns, perl-security, perl-testing, laravel-patterns,
laravel-plugin-discovery, laravel-security, laravel-tdd, laravel-verification,
rails-patterns, nestjs-patterns, mcp-server-patterns

**Frontend frameworks** (this repo's frontend is unbundled vanilla JS) —
react-patterns, react-performance, react-testing, react-native-patterns,
vue-patterns, ui-to-vue, nuxt4-patterns, angular-developer, frontend-patterns,
nextjs-turbopack, vite-patterns, bun-runtime, motion-advanced,
motion-foundations, motion-patterns, remotion-video-creation

**Mobile** — dart-flutter-patterns, flutter-dart-code-review,
swift-actor-persistence, swift-concurrency-6-2, swift-protocol-di-testing,
swiftui-patterns, android-clean-architecture, compose-multiplatform-patterns,
ios-icon-gen, liquid-glass-design, foundation-models-on-device

**Database** (this repo has none — fs-based binary saves only) —
postgres-patterns, mysql-patterns, redis-patterns, prisma-patterns,
database-migrations, clickhouse-io

**Infra/deploy** (no Dockerfile/CI here) — docker-patterns,
kubernetes-patterns, deployment-patterns, flox-environments, uncloud

**Testing infra** (no test framework installed yet) — e2e-testing,
ai-regression-testing, browser-qa, click-path-audit, canary-watch,
windows-desktop-e2e, ui-demo

**Design/a11y** — accessibility, frontend-a11y, design-system,
frontend-design-direction, make-interfaces-feel-better

**Architecture (premature at this repo's size)** — hexagonal-architecture,
contract-first, api-connector-builder, recsys-pipeline-architect,
latency-critical-systems, content-hash-cache-pattern,
data-throughput-accelerator, regex-vs-llm-structured-text

**Domain verticals** (no evidence in this repo) — healthcare-cdss-patterns,
healthcare-emr-patterns, healthcare-eval-harness, healthcare-phi-compliance,
hipaa-compliance, cisco-ios-patterns, network-bgp-diagnostics,
network-config-validation, network-interface-health, netmiko-ssh-automation,
homelab-network-readiness, homelab-network-setup, homelab-pihole-dns,
homelab-vlan-segmentation, homelab-wireguard-vpn, finance-billing-ops,
customer-billing-ops, investor-materials, investor-outreach, market-research,
competitive-platform-analysis, competitive-report-structure,
benchmark-methodology, lead-intelligence, connections-optimizer,
social-graph-ranker, project-flow-ops, customs-trade-compliance,
energy-procurement, inventory-demand-planning, logistics-exception-management,
production-scheduling, quality-nonconformance, returns-reverse-logistics,
carrier-relationship-management, master-agreement-generator,
esign-field-placement, visa-doc-translate, marketing-campaign, content-engine,
article-writing, brand-discovery, brand-voice, crosspost, social-publisher,
x-api, seo, video-editing, videodb, manim-video, fal-ai-media, taste,
taste-application, taste-distillation, tasteforge-video, frontend-slides,
scientific-db-pubmed-database, scientific-db-uspto-database, scientific-pkg-gget,
scientific-thinking-literature-review, scientific-thinking-scholar-evaluation,
defi-amm-security, evm-token-decimals, llm-trading-agent-security, ito-baskets,
ito-compute, ito-inference, ito-training, prediction-market-oracle-research,
prediction-market-risk-review, agent-payment-x402

**ECC meta/orchestration** — agent-eval, agent-architecture-audit,
agent-harness-construction, agent-introspection-debugging,
agent-self-evaluation, autonomous-agent-harness, autonomous-loops,
continuous-agent-loop, continuous-learning, continuous-learning-v2,
dynamic-workflow-mode, eval-harness, gan-style-harness, loop-design-check,
parallel-execution-optimizer, ralphinho-rfc-pipeline, recursive-decision-ledger,
santa-method, team-agent-orchestration, team-builder, dmux-workflows,
claude-devfleet, dev-team, skill-comply, skill-scout, skill-stocktake,
iterative-retrieval, intent-driven-development, inherit-legacy-style,
orch-add-feature, orch-build-mvp, orch-change-feature, orch-fix-defect,
orch-pipeline, orch-refine-code, plan-orchestrate, operator-approval-loop,
counterparty-channel-discipline, enterprise-agent-ops, ai-first-engineering,
nanoclaw-repl, dashboard-builder, knowledge-ops, unified-memory,
unified-notifications-ops, workspace-surface-audit, strategic-compact,
architecture-decision-records, living-docs-governance, rules-distill,
hookify-rules, config-gc, configure-ecc, ecc-guide, ecc-recipes,
ecc-tools-cost-audit, cost-aware-llm-pipeline, cost-tracking,
token-budget-advisor, repo-scan, security-bounty-hunter, security-scan,
safety-guard, gateguard, production-audit, growth-log, agent-sort,
product-capability, product-lens, plan-canvas, prompt-optimizer,
terminal-opener, terminal-ops, council, council-multi-model,
openclaw-persona-forge, nasiko-control-plane, hermes-imports,
opensource-pipeline, ml-adoption-playbook, mle-workflow, pytorch-patterns,
plankton-code-quality, codehealth-mcp, generating-python-installer,
data-scraper-agent, exa-search, deep-research, research-ops,
google-workspace-ops, jira-integration, github-ops, email-ops, messages-ops,
mailtrap-email-integration, nutrient-document-processing, blueprint

Full per-item evidence table was produced by `/ecc:agent-sort` on 2026-09-19.
