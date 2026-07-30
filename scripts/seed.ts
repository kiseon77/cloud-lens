// scripts/seed.ts
// 실행: npx tsx scripts/seed.ts
//
// 주의: SUPABASE_SERVICE_ROLE_KEY는 절대 NEXT_PUBLIC_ 접두사를 붙이지 말 것.
// 브라우저 번들에 노출되면 안 되는 키라서, 이 스크립트는 로컬 터미널에서만 실행한다.
//
// 사전 준비: npm install -D dotenv
// tsx로 직접 실행하는 스크립트는 Next.js와 달리 .env.local을 자동으로 읽지 않아서,
// 아래처럼 dotenv로 명시적으로 불러와야 한다.

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
const SPIKE_DAYS_AGO = 3; // 3일 전 EC2 비용에 의도적으로 스파이크를 심어서
// AnomalyAlertCard(+30% 룰)가 실제로 뭔가 감지하게 만든다

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

      if (d === SPIKE_DAYS_AGO && r.service === "EC2") {
        dailyCost *= 1.6; // 의도적 +60% 스파이크
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
    const { error } = await supabase.from("resource_costs").insert(chunk);
    if (error) throw error;
    console.log(`resource_costs: ${i + chunk.length}/${rows.length} 삽입 완료`);
  }
}

async function seedBudgetsAndAlerts() {
  const { error: budgetError } = await supabase.from("budgets").insert([
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
  ]);
  if (budgetError) throw budgetError;
  console.log("budgets 삽입 완료");

  const { error: alertError } = await supabase.from("alert_rules").insert([
    {
      id: "alert-backend-80",
      budget_id: "budget-backend",
      description: "backend 예산 80% 초과 시",
      channel: "email",
      is_active: true,
    },
  ]);
  if (alertError) throw alertError;
  console.log("alert_rules 삽입 완료");
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
