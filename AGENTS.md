<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project overview

CloudLens — AWS 비용 모니터링/FinOps 대시보드. Next.js(App Router) + TypeScript 기반 1인 포트폴리오 프로젝트. 상세 도메인 규칙과 컴포넌트 명세는 `CLAUDE.md` 참고.

## Setup commands

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Code style

- TypeScript strict 모드 유지, `any` 사용 지양
- 컴포넌트 이름은 `CLAUDE.md`의 컴포넌트 명세(`SummaryCard`, `AnomalyAlertCard`, `CostDataTable` 등)와 반드시 일치시킬 것
- UI는 Tailwind + shadcn/ui 컴포넌트를 우선 사용, 커스텀 CSS는 최소화
- 서버 상태 관리는 TanStack Query, 폼은 react-hook-form + zod로 통일

## Testing instructions

- 현재 별도 테스트 스위트 없음 (추가되면 이 섹션에 실행 명령어 기록)
- 커밋 전 `npm run lint`와 `npm run build`가 에러 없이 통과하는지 확인

## PR instructions

- 브랜치명: `sprint{n}/{기능명}` 형식 (예: `sprint1/summary-card`)
- PR 제목은 한 줄 요약으로 작성
- 이 저장소는 PR마다 Claude 기반 자동 리뷰가 달림(`.github/workflows/claude-code-review.yml`) — 코멘트에서 Blocking으로 표시된 항목은 머지 전에 반드시 해결

## Security considerations

- Supabase anon key 등 민감 값은 `.env.local`에만 두고 절대 커밋하지 않음
- 클라이언트 사이드 쿼리에서 다른 사용자의 데이터에 접근 가능한 구조를 만들지 않음
