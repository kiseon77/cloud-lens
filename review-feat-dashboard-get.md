# CloudLens `feat/dashboard-get` → `main` 코드 리뷰

*이 리뷰는 Claude(AI)가 작성했습니다.*

---

## Blocking

### [Blocking] (proxy.ts 부재) — Next.js 16 proxy 엔트리포인트가 없어 인증 검증이 통째로 죽어있음
`lib/supabase/middleware.ts`에 `updateSession()` 함수가 정의되어 있고, 그 안에 `getUser()` 기반 세션 검증 + 미인증 시 `/login` 리다이렉트 + 로그인 상태에서 `/login` 접근 시 `/` 리다이렉트 로직까지 완비되어 있다. 하지만 저장소 어디에도 이 `updateSession`을 호출하는 `proxy.ts`(Next.js 16 컨벤션)나 구버전 `middleware.ts`(루트)가 존재하지 않는다. `updateSession`은 코드베이스 전체에서 정의만 되고 아무 곳에서도 import되지 않는 완전한 dead code다. 결과적으로 로그인하지 않은 사용자도 `/`, `/budgets` 등 모든 라우트에 자유롭게 접근 가능하다 — 인증 게이트 자체가 존재하지 않는 것과 같다. 루트에 `proxy.ts`를 만들어 `updateSession(request)`을 호출하고 `matcher` 설정을 해야 한다.

### [Blocking] lib/hooks/useRegionBreakdownChart.ts:1-36 — 파일명과 실제 내용이 완전히 다른 기능이며, 이 잘못된 경로가 실제로 import되어 쓰이고 있음
파일명은 `useRegionBreakdownChart`인데 실제 export된 함수는 `useToggleAlertRule`이며 내용도 "리전별 비용 breakdown 조회"와 전혀 무관한 "알림 규칙 활성화 토글" mutation이다. 진짜 리전별 차트 데이터를 가져오는 훅은 `lib/hooks/useServiceBreakdownChart.ts`와 구조가 같은 `getRegionBreakdownChart` 쿼리를 감싸는 별도 훅이어야 하는데, 그 훅 자체가 존재하지 않는다.
그런데 `components/budgets/AlertRuleList.tsx:15`에서 `import useToggleAlertRule from "@/lib/hooks/useRegionBreakdownChart";`로 이 잘못된 경로를 실제로 import해서 쓰고 있고, `app/(dashboard)/page.tsx`에서는 `import useRegionBreakdownChart from "@/lib/hooks/useRegionBreakdownChart";`로 같은 파일을 리전 차트용으로 호출한다. 즉 대시보드 페이지의 `useRegionBreakdownChart()` 호출은 실제로는 `useToggleAlertRule`을 리전 차트 훅인 것처럼 실행하고 있는 셈이다 — 함수 시그니처(파라미터 없음 vs `{id, is_active}` mutate 인자)가 완전히 다르므로 `RegionBreakdownChart`에 전달되는 `data`는 항상 `undefined`가 되어 차트가 비어 보일 것이다. 파일을 올바르게 분리해야 한다: `useRegionBreakdownChart.ts`는 `getRegionBreakdownChart` 쿼리를 감싸는 새 파일로, `useToggleAlertRule`은 별도 파일(`useToggleAlertRule.ts`)로 옮겨야 한다.

### [Blocking] components/dashboard/AnomalyAlertCard.tsx:29-31, app/(dashboard)/page.tsx:66-72 — 이상 비용 감지(+30%) 로직이 유틸/훅으로 분리되지 않고 두 곳에 중복 하드코딩됨
CLAUDE.md는 "전일 대비 +30% 이상 증가 시 노출" 로직을 한 곳(유틸 함수/훅)에 모아두라고 명시한다. 그런데 동일한 계산식 `(item.daily_cost - item.prev_day_cost) / item.prev_day_cost * 100 > 30` 형태의 로직이 `app/(dashboard)/page.tsx`의 `AnomalyAlertList` 함수와 (부분적으로) `AnomalyAlertCard.tsx`의 표시 로직 양쪽에 나뉘어 하드코딩되어 있다. 필터링(30% 초과 여부 판단)은 `page.tsx`에서, 퍼센트 텍스트 표시는 `AnomalyAlertCard.tsx`에서 각각 독립적으로 재계산한다. 나중에 임계값(30%)을 바꾸거나 계산식을 수정해야 할 때 두 곳을 모두 고쳐야 하고, 실제로 아래 버그처럼 계산식이 서로 미묘하게 어긋나 있다. `lib/utils/anomaly.ts` 같은 단일 유틸(예: `detectAnomalies(data: Anomaly[]): Anomaly[]`, `getAnomalyPercent(item: Anomaly): number`)로 분리해야 한다.

### [Blocking] components/dashboard/AnomalyAlertCard.tsx:44-46 — 퍼센트 계산 연산자 우선순위 버그로 급증률이 항상 부정확하게 표시됨
```ts
{Math.round((item.daily_cost - item.prev_day_cost) / item.prev_day_cost) * 100}%
```
`Math.round(...)`가 먼저 적용된 뒤 `* 100`이 실행된다. 예를 들어 daily_cost=130, prev_day_cost=100이면 비율은 0.3인데, `Math.round(0.3)`은 `0`이 되고 `0 * 100 = 0`이 표시된다. 실제 30% 급증인데 "0% 급증"이라고 사용자에게 보여주는 셈이다. 비율이 1.5 이상(150% 이상 증가)이 되어야만 `Math.round`가 1 이상을 반환해 100의 배수로 튀어나온다. 올바른 식은 `Math.round(((item.daily_cost - item.prev_day_cost) / item.prev_day_cost) * 100)`이다 (괄호 위치만 바뀌면 됨). FinOps 대시보드의 핵심 지표인 이상 비용 급증률이 사실상 항상 틀린 값을 보여주는 것은 제품 신뢰도에 직결되는 문제다.

### [Blocking] components/dashboard/AnomalyAlertCard.tsx:42 — key에 콤마 연산자를 사용해 React key가 사실상 무의미함
```ts
<div key={(item.service, item.region)}>
```
JS 콤마 연산자로 인해 `key`는 실제로 `item.region` 값 하나만 사용된다(`item.service`는 평가만 되고 버려짐). 같은 리전에서 여러 서비스가 동시에 이상 급증한 경우 key가 중복되어 React 렌더링 경고 및 잘못된 DOM 재사용이 발생한다. `key={`${item.service}-${item.region}`}` 형태로 고쳐야 한다.

### [Blocking] components/dashboard/BudgetProgressCard.tsx — 예산 80% 소진 경고 색상 로직이 아예 구현되어 있지 않음
CLAUDE.md 도메인 로직 규칙: "예산의 80% 소진 시 BudgetProgressCard 색상을 경고색으로 전환." 그러나 현재 구현은 `{totalLimit}%`와 `<Slider value={totalLimit} />`, 개별 항목의 `<Slider value={data.threshold_percent} />`만 렌더링할 뿐, 소진율이 80%를 넘었을 때 색상을 바꾸는 조건부 스타일 자체가 코드에 없다. 이상 비용 감지 로직처럼 이것도 한 곳(유틸/훅)에 모아야 하는데, 그 이전에 기능 자체가 누락되어 있다. 명세된 핵심 도메인 로직이 통째로 빠진 것이므로 Blocking으로 분류한다.

### [Blocking] components/dashboard/BudgetProgressCard.tsx:15,29 — Slider에 number를 그대로 전달해 타입/런타임 불일치 가능성
```tsx
<Slider value={totalLimit} />   // totalLimit: number
...
<Slider value={data.threshold_percent} />  // number
```
shadcn/ui의 `Slider`(Radix 기반)는 `value` prop으로 `number[]`를 기대한다(`thresholdSlider.tsx`의 커스텀 슬라이더도 `Array.isArray(value)`로 분기하는 것에서 이 컨벤션이 확인됨). `number`를 그대로 넘기면 TypeScript 컴파일 에러가 나거나(strict 모드), 통과하더라도 내부적으로 `.map`/배열 연산에서 런타임 에러가 날 가능성이 높다. `value={[totalLimit]}`, `value={[data.threshold_percent]}`로 배열로 감싸야 한다. (`npm run build`가 실제로 통과하는지 CI에서 재확인 필요.)

### [Blocking] lib/queries/*.ts (getAlertRule.ts, getBudgetSearch.ts, postAddAlertRule.ts, postAddBudget.ts, toggleAlertRuleActive.ts, updateAlertRule.ts, updateBudget.ts) — 함수 파라미터에 타입이 전혀 없어 암묵적 `any`
```ts
export default async function getAlertRule(budgetId) { ... }
export default async function postAddAlertRule(payload) { ... }
export default async function toggleAlertRuleActive({ id, is_active }) { ... }
export default async function updateAlertRule({ id, ...payload }) { ... }
export default async function updateBudget({ id, ...payload }) { ... }
```
TypeScript strict 모드(AGENTS.md에 명시)에서 파라미터 타입 미지정은 `noImplicitAny` 규칙에 걸려 빌드 자체가 실패하거나(현재 tsconfig 설정에 따라 다름), 통과하더라도 Supabase 생성 타입과 무관하게 아무 값이나 넘길 수 있는 상태다. `payload: BudgetPayload`, `budgetId: string | number`, `{ id, is_active }: { id: string | number; is_active: boolean }` 등으로 명시해야 한다. CLAUDE.md가 "Supabase 생성 타입 사용 여부"를 리뷰 기준 1순위로 두고 있는데, `lib/type.ts`/`lib/postType.ts`는 수기로 작성된 타입이고 Supabase CLI로 생성된 `Database` 타입을 전혀 참조하지 않아 스키마 변경 시 타입이 조용히 어긋날 위험이 크다.

---

## Should-fix

### [Should-fix] app/(dashboard)/page.tsx:60-65 — 전월 대비 증감률 계산에서 undefined 뺄셈으로 NaN 발생 가능
```ts
const monthCostDataFooterText = () => {
  if (ThisMonthCostData?.data - BeforeMonthCostData?.data > 0) {
```
`?.`로 optional chaining을 쓰면서 뺄셈 자체는 그대로 수행하고 있다. 로딩 중이거나 에러 시 `ThisMonthCostData` 또는 `BeforeMonthCostData`가 `undefined`이면 `undefined - undefined = NaN`이 되고, `NaN > 0`은 항상 `false`라 조용히 빈 문자열을 반환한다. 겉보기엔 안전해 보이지만 실제로는 로딩 상태와 "변동 없음" 상태를 구분하지 못하고 있다.

### [Should-fix] app/(dashboard)/page.tsx 전체 — 7개 쿼리 모두 isLoading/error를 구조분해만 하고 실제로 분기 처리하지 않음
`ThisMonthCostLoading`, `ThisMonthCostError`, `budgetLimitLoading`, `budgetLimitError` 등 총 7세트의 `isLoading`/`error`를 각 훅에서 꺼내오지만, JSX 어디에서도 이 값들을 사용하지 않는다. 로딩 중에는 `ThisMonthCostData?.data.toFixed(2)`가 `undefined.toFixed`로 런타임 에러를 던질 수 있고(옵셔널 체이닝이 `.data`까지만 걸려있고 `.toFixed`는 안 걸려있음), 에러 시에도 사용자에게 아무 피드백이 없다. CLAUDE.md 리뷰 기준의 "로딩/에러 상태 분기 처리 여부"에 정면으로 걸리는 항목이다. 최소한 스켈레톤/에러 메시지 컴포넌트로 분기해야 한다.

### [Should-fix] components/auth/LoginForm.tsx:11-19 vs lib/auth.ts:3-7 — loginSchema가 두 곳에 중복 정의되어 있고 서로 내용도 다름
`lib/auth.ts`에 이미 `loginSchema`/`LoginFormValues`가 export되어 있는데, `LoginForm.tsx`는 이를 import하지 않고 자체적으로 이름이 같은 `loginSchema`를 다시 정의한다. 게다가 두 스키마는 서로 미묘하게 다르다 — `lib/auth.ts`는 `z.email({ error: ... })`(Zod v4 스타일), `LoginForm.tsx`는 `.email({ message: ... })`(Zod v3 스타일 체이닝)이며 비밀번호 최소 길이도 `lib/auth.ts`는 6자, `LoginForm.tsx`는 1자다. 어느 쪽이 실제로 쓰이는 진실인지 알 수 없는 상태이므로 `lib/auth.ts`의 dead code를 제거하고 `LoginForm.tsx`가 이를 import하도록 통일해야 한다.

### [Should-fix] components/auth/LoginForm.tsx:58 — 관리자 크리덴셜이 화면에 평문으로 노출됨
```tsx
<p>admin@admin.com admin1234</p>
```
데모/개발 편의를 위한 것으로 보이나, 로그인 폼 자체에 테스트 계정 이메일/비밀번호가 하드코딩되어 화면에 항상 렌더링된다. 포트폴리오 데모 목적이라도 프로덕션 배포(Vercel) 시 그대로 노출되면 보안 관례상 바람직하지 않다. 최소한 `NODE_ENV === "development"` 조건부 렌더링으로 감싸거나 완전히 제거를 권장한다.

### [Should-fix] components/budgets/AlertRuleForm.tsx:157-160 — 임계치 슬라이더 라벨이 htmlFor로 연결되어 있지 않음
```tsx
<p className="text-sm text-muted-foreground mb-1">임계치 {threshold}%</p>
<ThresholdSlider ... />
```
`<p>` 태그로만 표시되고 `<label htmlFor="...">`가 아니라서 스크린 리더 사용자가 슬라이더와 이 라벨의 연결 관계를 알 수 없다. `ThresholdSlider`(base-ui 기반)에 `id`를 부여하고 `<label htmlFor={id}>` 혹은 `aria-labelledby`로 연결해야 한다. 이메일/슬랙 채널 선택 버튼도 실질적으로 단일 선택 토글(라디오 그룹처럼 동작)인데 `<Button>`만 쓰고 `aria-pressed`나 `role="radiogroup"` 등의 시맨틱이 없어 상태 변화가 보조기술에 전달되지 않는다.

### [Should-fix] lib/hooks/useBudgetLimit.ts 등 다수 훅 — Supabase 반환 error를 삼키고 throw하지 않아 TanStack Query의 에러 상태로 전파되지 않음
`getBudgetLimit.ts`, `getBudgetSearch.ts`, `getCostAnomalies.ts`, `getDailyCost.ts`, `getMonthCost.ts`, `getRegionBreakdownChart.ts`, `getServiceBreakdownChart.ts`는 모두 Supabase의 `{ data, error }`를 그대로 `return { data, error }`로 반환할 뿐, `error`가 있을 때 `throw`하지 않는다(반면 `getAlertRule.ts`, `postAddAlertRule.ts` 등은 `throw new Error(error.message)`를 하고 있어 파일 간 컨벤션이 불일치). TanStack Query는 `queryFn`이 throw해야 `isError`/`error` 상태로 전환되므로, 이 훅들은 Supabase 쿼리가 실패해도 `useQuery`의 `error`가 항상 `null`이고 `data`는 `{ data: null, error: {...} }` 형태의 객체가 되어버린다.

### [Should-fix] tsconfig.json:31 — 오타 경로가 include 배열에 커밋됨
파일 확장자가 `.ts`가 아니라 한글 자모 "ㅅ"이 섞인 잘못된 경로로 오타나 있다. 실제 존재하지 않는 경로라 TypeScript가 무시하고 넘어가지만, 실수로 커밋된 흔적이 남아있는 것 자체가 리뷰/머지 전 정리가 안 됐다는 신호다. 제거해야 한다.

---

## Nit

### [Nit] lib/hooks/useMonthCalculation.tsx:6-9 — 전월 계산 시 연도 처리가 이름과 다르게 동작(1월에는 실제로 문제 발생 가능)
`y`는 `d.getFullYear()`(즉 `now`의 연도)를 쓰지만 `m`은 파라미터로 받은 `getMonthNumber`를 그대로 문자열화해서 쓴다. `page.tsx`에서 전월 데이터 조회 시 `getMonthNumber: new Date().getMonth()`(0-indexed)를 전달하는데, 이 값이 1월(`getMonthNumber=0`)이 되면 존재하지 않는 월 `"00"`으로 쿼리하게 된다. 즉 매년 1월에 "전월 대비" 비교가 깨진다. 당장은 드러나지 않는 잠재 버그라 Nit으로 분류하되, 실사용 전 반드시 확인 필요.

### [Nit] components/dashboard/SummaryCard.tsx — `data` prop 타입이 `string`으로 고정되어 있으나 실제로는 `number`도 넘어옴
`app/(dashboard)/page.tsx`에서 `data={costAnomaliesData?.data.length}`(number)를 `SummaryCard`의 `data: string` prop에 전달한다. TypeScript strict라면 타입 에러가 나야 정상인데 빌드가 통과한다면 `strict` 설정이 실제로는 느슨하거나 다른 억제 요인이 있는지 확인이 필요하다.

### [Nit] components/dashboard/CostTrendChart.tsx, RegionBreakdownChart.tsx, ServiceBreakdownChart.tsx — 반응형 컨테이너 미사용
Recharts의 `ResponsiveContainer` 없이 고정 픽셀 값 위주로 쓰고 있어 실제 반응형 레이아웃에서 잘리거나 여백이 어색해질 가능성이 있다. 대시보드 그리드가 반응형인 점을 고려하면 `ResponsiveContainer`로 감싸는 것이 정석이다.

### [Nit] lib/queries/getBudgetScopeOptions.ts:7 — Prettier 포맷팅 불일치로 보이는 줄바꿈
프로젝트 전반은 메서드 체이닝 시 줄바꿈을 하는 스타일인데 이 파일만 한 줄로 이어져 있다. `npm run lint`/Prettier 재실행으로 정리하면 좋다.

---

## 전체 요약

**Blocking 8건, Should-fix 6건, Nit 4건.** 가장 심각한 문제는 (1) `proxy.ts` 부재로 인증 게이트가 전혀 동작하지 않아 누구나 로그인 없이 전체 대시보드에 접근 가능하다는 점, (2) `useRegionBreakdownChart.ts` 파일명과 내용이 뒤바뀌어 실제로 잘못된 훅이 대시보드와 알림 목록 양쪽에서 쓰이고 있다는 점, (3) CLAUDE.md가 명시한 이상탐지·예산경고 두 도메인 로직이 한쪽은 중복 하드코딩되고 다른 한쪽(예산 80% 경고색)은 아예 구현조차 안 되어 있다는 점, (4) 이상 비용 급증률 계산에 연산자 우선순위 버그가 있어 핵심 지표가 항상 틀린 값을 보여준다는 점이다. Should-fix 항목들(로딩/에러 미처리, 쿼리 에러 처리 불일치, LoginForm 스키마 중복, 접근성 누락)도 프로덕션 품질 기준으로는 무시하기 어렵다. 현재 상태로는 머지 불가이며, 최소한 Blocking 8건 전부와 Should-fix의 로딩/에러 처리·인증 관련 항목은 해결 후 재리뷰가 필요하다.
