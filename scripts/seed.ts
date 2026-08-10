// scripts/seed.ts
// 실행: npx tsx scripts/seed.ts
//
// 주의: SUPABASE_SERVICE_ROLE_KEY는 절대 NEXT_PUBLIC_ 접두사를 붙이지 말 것.
// 브라우저 번들에 노출되면 안 되는 키라서, 이 스크립트는 로컬 터미널에서만 실행한다.
//
// 사전 준비: npm install -D dotenv
// tsx로 직접 실행하는 스크립트는 Next.js와 달리 .env.local을 자동으로 읽지 않아서,
// 아래처럼 dotenv로 명시적으로 불러와야 한다.
//
// 이 스크립트는 여러 번 실행해도 안전하다 (upsert 기반).
// 같은 id가 있으면 덮어쓰고, 없으면 새로 추가한다.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    ".env.local에서 NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY를 찾지 못했습니다. 파일 위치와 변수명을 확인하세요.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// 1. 고정된 "리소스 명단" — 매번 랜덤 리소스를 새로 만드는 대신,
//    실제 회사처럼 몇 개 안 되는 서버/버킷/DB가 매일 비용을 발생시키는
//    구조를 흉내낸다. 필요하면 항목을 더 추가해도 된다.
const RESOURCES = [
  {
    id: "i-0abcd1234ef567890",
    name: "prod-api-server-01",
    service: "EC2",
    region: "ap-northeast-2",
    instanceType: "t3.medium",
    baseCost: 3.4,
    team: "backend",
    env: "production",
    project: "core-api",
  },
  {
    id: "i-0abcd1234ef567891",
    name: "prod-api-server-02",
    service: "EC2",
    region: "ap-northeast-2",
    instanceType: "t3.medium",
    baseCost: 3.4,
    team: "backend",
    env: "production",
    project: "core-api",
  },
  {
    id: "bucket-user-uploads-prod",
    name: "user-uploads-prod",
    service: "S3",
    region: "ap-northeast-2",
    instanceType: null,
    baseCost: 1.0,
    team: "platform",
    env: "production",
    project: "media-storage",
  },
  {
    id: "db-prod-main",
    name: "prod-db-main",
    service: "RDS",
    region: "us-east-1",
    instanceType: "db.t3.large",
    baseCost: 9.8,
    team: "backend",
    env: "production",
    project: "core-api",
  },
  {
    id: "fn-cost-anomaly-checker",
    name: "cost-anomaly-checker",
    service: "Lambda",
    region: "ap-northeast-2",
    instanceType: null,
    baseCost: 0.4,
    team: "platform",
    env: "production",
    project: "finops-tools",
  },
  {
    id: "cdn-static-assets",
    name: "static-assets-cdn",
    service: "CloudFront",
    region: "us-east-1",
    instanceType: null,
    baseCost: 1.5,
    team: "platform",
    env: "production",
    project: "media-storage",
  },
];

const DAYS = 90;

// 2. 서비스별 이상치 시나리오
//    실제 AWS 비용 이상치는 서비스마다 원인과 패턴이 다르다.
//    - EC2: 오토스케일링 오작동/사이징 실수 → 하루짜리 스파이크
//    - Lambda: 무한루프/재귀 호출 버그 → 하루짜리 초극단 스파이크
//    - S3: 대량 다운로드(egress) 폭증 → 원인 파악 전까지 며칠 지속
//    - CloudFront: 봇 크롤링/트래픽 폭증 → 하루짜리 스파이크
//    - RDS: 백업 스토리지 누적 → 스파이크가 아니라 완만한 상승 트렌드
//
//    daysAgo: 오늘로부터 며칠 전에 발생했는지 (범위는 [start, end] 포함)
//    multiplier: 그 기간 daily_cost에 곱해질 배율
type SpikeScenario = {
  service: string;
  daysAgoStart: number;
  daysAgoEnd: number;
  multiplier:
    | number
    | ((daysAgo: number, start: number, end: number) => number);
  reason: string;
};

const SPIKE_SCENARIOS: SpikeScenario[] = [
  // 기본 조회 범위(days_back=7) 안에서 anomaly가 항상 1건 이상 잡히도록 보장하는 스파이크.
  // EC2 baseCost(3.4) x 6배 → 17~23 수준으로, avg_7d + 3*stddev_7d(약 4~5)와
  // daily_cost > 10 조건을 여유 있게 넘긴다. 기존 3일 전 EC2 스파이크와 겹치지 않게 2일 전으로 설정.
  {
    service: "EC2",
    daysAgoStart: 2,
    daysAgoEnd: 2,
    multiplier: 6, // +500%, get_cost_anomalies() 기본 호출(days_back=7) 검증용 보장 스파이크
    reason: "[검증용] 기본 조회 범위 내 anomaly 보장",
  },
  {
    service: "EC2",
    daysAgoStart: 3,
    daysAgoEnd: 3,
    multiplier: 1.6, // +60%
    reason: "오토스케일링 오작동으로 인스턴스 과다 증설",
  },
  {
    service: "Lambda",
    daysAgoStart: 7,
    daysAgoEnd: 7,
    multiplier: 3.5, // +250%
    reason: "재귀 호출 버그로 인한 무한 실행",
  },
  {
    service: "S3",
    daysAgoStart: 12,
    daysAgoEnd: 14,
    multiplier: 1.9, // +90%
    reason: "퍼블릭 버킷 대량 다운로드(egress 폭증)",
  },
  {
    service: "CloudFront",
    daysAgoStart: 20,
    daysAgoEnd: 20,
    multiplier: 2.2, // +120%
    reason: "봇 크롤링으로 인한 트래픽 폭증",
  },
  {
    service: "RDS",
    daysAgoStart: 0,
    daysAgoEnd: 29,
    multiplier: (daysAgo, start, end) => {
      const progress = 1 - daysAgo / end;
      return 1 + 0.4 * Math.max(0, progress);
    },
    reason: "자동 백업 스토리지 누적으로 인한 완만한 비용 상승",
  },
];

function resolveMultiplier(scenario: SpikeScenario, daysAgo: number): number {
  if (typeof scenario.multiplier === "number") return scenario.multiplier;
  return scenario.multiplier(
    daysAgo,
    scenario.daysAgoStart,
    scenario.daysAgoEnd,
  );
}

function findScenario(
  service: string,
  daysAgo: number,
): SpikeScenario | undefined {
  return SPIKE_SCENARIOS.find(
    (s) =>
      s.service === service &&
      daysAgo >= s.daysAgoStart &&
      daysAgo <= s.daysAgoEnd,
  );
}

type Row = {
  id: string;
  resource_name: string;
  service: string;
  region: string;
  instance_type: string | null;
  pricing_model: string;
  usage_type: string | null;
  usage_quantity: number;
  usage_unit: string;
  daily_cost: number;
  monthly_cost: number;
  tags: Record<string, string>;
  cost_date: string;
};

function buildResourceCostRows(): Row[] {
  const rows: Row[] = [];
  const today = new Date();

  for (let d = 0; d < DAYS; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);

    for (const r of RESOURCES) {
      const noise = faker.number.float({ min: 0.85, max: 1.15 });
      let dailyCost = r.baseCost * noise;

      const scenario = findScenario(r.service, d);
      if (scenario) {
        dailyCost *= resolveMultiplier(scenario, d);
      }

      rows.push({
        id: `${r.id}-${dateStr}`,
        resource_name: r.name,
        service: r.service,
        region: r.region,
        instance_type: r.instanceType,
        pricing_model: "OnDemand",
        usage_type: r.service === "EC2" ? `BoxUsage:${r.instanceType}` : null,
        usage_quantity: 24,
        usage_unit: "Hrs",
        daily_cost: Number(dailyCost.toFixed(2)),
        monthly_cost: Number((dailyCost * 30).toFixed(2)),
        tags: { Team: r.team, Environment: r.env, Project: r.project },
        cost_date: dateStr,
      });
    }
  }
  return rows;
}

async function seedResourceCosts() {
  const rows = buildResourceCostRows();
  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    // insert 대신 upsert: 같은 id(resourceId-date)가 이미 있으면 덮어쓰고,
    // 없으면 새로 추가한다. 여러 번 실행해도 PK 충돌이 나지 않는다.
    const { error } = await supabase
      .from("resource_costs")
      .upsert(chunk, { onConflict: "id" });
    if (error) throw error;
    console.log(
      `resource_costs: ${i + chunk.length}/${rows.length} upsert 완료`,
    );
  }

  // 어떤 이상치가 심어졌는지 콘솔에 요약 출력 (디버깅/검증용)
  console.log("\n심어진 이상치 시나리오:");
  for (const s of SPIKE_SCENARIOS) {
    const range =
      s.daysAgoStart === s.daysAgoEnd
        ? `${s.daysAgoStart}일 전`
        : `${s.daysAgoEnd}~${s.daysAgoStart}일 전`;
    console.log(`  - ${s.service}: ${range} — ${s.reason}`);
  }
}

async function seedBudgetsAndAlerts() {
  const { error: budgetError } = await supabase.from("budgets").upsert(
    [
      {
        id: "budget-backend",
        scope_type: "team",
        scope_value: "backend",
        monthly_limit: 15000,
        current_spend: 11230.4,
        threshold_percent: 80,
        alert_channel: "email",
        is_active: true,
      },
      {
        id: "budget-platform",
        scope_type: "team",
        scope_value: "platform",
        monthly_limit: 8000,
        current_spend: 7600,
        threshold_percent: 80,
        alert_channel: "email",
        is_active: true,
      },
    ],
    { onConflict: "id" },
  );
  if (budgetError) throw budgetError;
  console.log("budgets upsert 완료");

  const { error: alertError } = await supabase.from("alert_rules").upsert(
    [
      {
        id: "alert-backend-80",
        budget_id: "budget-backend",
        description: "backend 예산 80% 초과 시",
        channel: "email",
        is_active: true,
      },
    ],
    { onConflict: "id" },
  );
  if (alertError) throw alertError;
  console.log("alert_rules upsert 완료");
}

async function main() {
  console.log("시딩 시작");
  await seedResourceCosts();
  await seedBudgetsAndAlerts();
  console.log("시딩 완료");
}

main().catch((err) => {
  console.error("시딩 실패:", err);
  process.exit(1);
});
