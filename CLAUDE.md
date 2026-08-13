# CloudLens — 프로젝트 컨텍스트

@AGENTS.md

이 파일은 Claude Code(로컬 서브에이전트 `frontend-veteran-reviewer`와 GitHub Actions `claude-code-review.yml` 모두)가 이 저장소에서 작업할 때 공통으로 참고하는 기준이다. 위의 `@AGENTS.md` 줄은 Claude Code가 자동으로 읽지 않는 AGENTS.md(nextjs-agent-rules)를 이 파일 안으로 끌어와 함께 읽게 만드는 import 구문이다 — AGENTS.md에 이미 있는 Next.js 관련 규칙을 여기 중복해서 다시 쓸 필요가 없다.

## 프로젝트 개요

CloudLens는 AWS 비용 데이터를 시각화하고 예산 초과·이상 비용을 감지하는 B2B FinOps 대시보드다. 1년 차 프론트엔드 개발자가 클라우드 MSP 취업을 목표로 4주간 혼자 만드는 포트폴리오 프로젝트이며, 메가존클라우드 PDC팀의 실제 업무 방식(2주 스프린트, 이벤트스토밍, 스펙 없이 먼저 착수하기)을 리서치해 1인 개발에 맞게 시뮬레이션하고 있다.

## 기술 스택

| 영역           | 선택                                           |
| -------------- | ---------------------------------------------- |
| 프레임워크     | Next.js (App Router), TypeScript               |
| 스타일링 / UI  | Tailwind CSS + shadcn/ui                       |
| 차트           | Recharts (shadcn charts 래퍼)                  |
| 데이터 테이블  | TanStack Table                                 |
| 서버 상태 관리 | TanStack Query                                 |
| 폼 & 검증      | react-hook-form + zod                          |
| 데이터 레이어  | Supabase (Auth + PostgreSQL) — MSW는 쓰지 않음 |
| 배포           | Vercel                                         |

## 데이터 스키마 (Supabase)

- `resource_costs`: 리소스별 일일 비용 원본 테이블. 상세 비용 탐색기(페이지 2)의 소스이자, 일별/월별 집계의 기반.
- `daily_cost_summary`: 별도 테이블이 아니라 `resource_costs`를 `GROUP BY`한 Postgres 뷰 또는 쿼리 결과.
- `budgets`: 팀/프로젝트별 월 예산, 임계치, 알림 채널.
- `alert_rules`: 예산 초과 알림 규칙.

## 컴포넌트 명세 (컴포넌트 이름은 이 명세와 반드시 일치해야 함)

**페이지 1 (대시보드 메인)**: `SummaryCard`, `BudgetProgressCard`, `AnomalyAlertCard`, `CostTrendChart`, `ServiceBreakdownChart`, `RegionBreakdownChart`, `DateRangePicker`

**페이지 2 (상세 비용 탐색기)**: `CostDataTable`, `FilterBar`, `SearchInput`, `SortableColumnHeader`, `ColumnVisibilityToggle`, `Pagination`, `ExportCsvButton`, `EmptyState`

**페이지 3 (예산 관리 & 알림)**: `BudgetForm`, `BudgetList`, `AlertRuleForm`, `AlertRuleList`, `ConfirmDialog`, `ToastNotification`

## 도메인 로직 규칙

- 이상 비용 감지: 전일 대비 +30% 이상 증가 시 `AnomalyAlertCard`에 노출
- 예산 경고: 예산의 80% 소진 시 `BudgetProgressCard` 색상을 경고색으로 전환
- 이 두 로직은 여러 컴포넌트에 중복 하드코딩하지 않고 한 곳(유틸 함수/훅)에 모아둔다

## 작업 순서 원칙 — "스키마-First"

1. Supabase 테이블 스키마를 먼저 정의한다
2. 컴포넌트 마크업 + TanStack Query 훅 골격을 더미 데이터로 먼저 작성한다
3. 실제 데이터 연동과 스타일 디테일은 골격이 동작한 뒤 마지막에 붙인다

## 코드 리뷰 기준

`frontend-veteran-reviewer` 서브에이전트와 GitHub Action 리뷰는 아래 기준을 Blocking / Should-fix / Nit 세 등급으로 나눠 적용한다.

- 타입 안전성 (`any` 남용, Supabase 생성 타입 사용 여부)
- TanStack Query 패턴 (쿼리 키 구조, 로딩/에러 분기)
- 성능 (대용량 테이블 가상화·페이지네이션, 불필요한 리렌더)
- 접근성 (aria-label, 키보드 포커스, label-input 연결)
- 도메인 로직 일관성 (이상탐지·예산 로직 중복 여부)
- Supabase 보안 (키 하드코딩 금지, 민감 쿼리 노출 여부)

모든 AI 리뷰 코멘트에는 "이 리뷰는 Claude(AI)가 작성했습니다"라는 문구를 남겨 AI 피드백임을 투명하게 밝힌다.
