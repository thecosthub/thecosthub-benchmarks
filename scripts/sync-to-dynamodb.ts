import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.DYNAMODB_TABLE_BENCHMARKS || "TheCostHubBenchmarks";
const REGION = process.env.AWS_REGION || "eu-west-2";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

async function syncTask(taskFile: string): Promise<void> {
  const content = fs.readFileSync(taskFile, "utf-8");
  const task = yaml.parse(content);

  const item = {
    pk: `BENCHMARK#${task.benchmark_id}`,
    sk: "TYPE#leaderboard",
    status: "PUBLISHED",
    source: "github-verified",
    last_updated: new Date().toISOString(),
    git_commit: process.env.GITHUB_SHA || "local",
    git_run_url: process.env.GITHUB_SERVER_URL
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : "local",
    // Spread all task data
    id: task.benchmark_id,
    name: task.name,
    category: task.category,
    description: task.description,
    stpRate: task.ai_pipeline.stp_rate,
    p95LatencyMs: task.ai_pipeline.p95_latency_ms || task.ai_pipeline.latency_ms,
    humanBaseline: {
      role: task.human_baseline.role,
      hourlyRate: task.human_baseline.hourly_rate_usd,
      minutesPerUnit: task.human_baseline.minutes_per_unit,
      costPerUnit: (task.human_baseline.hourly_rate_usd / 60) * task.human_baseline.minutes_per_unit,
      overheadMultiplier: 1.25,
      effectiveCostPerUnit: ((task.human_baseline.hourly_rate_usd / 60) * task.human_baseline.minutes_per_unit) * 1.25,
      source: task.human_baseline.source,
    },
    saasBaseline: task.saas_baseline || null,
    aiPipeline: {
      models: task.ai_pipeline.models,
      costPerUnit: task.ai_pipeline.cost_per_unit_usd,
      promptTokens: task.ai_pipeline.prompt_tokens_avg,
      completionTokens: task.ai_pipeline.completion_tokens_avg,
      latencyMs: task.ai_pipeline.latency_ms,
      accuracyScore: task.ai_pipeline.accuracy_score,
      humanFallbackRate: task.ai_pipeline.human_fallback_rate,
    },
    volumeConfig: task.volume_config,
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  console.log(`✅ Synced ${task.benchmark_id} to ${TABLE_NAME}`);
}

async function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    // Sync all tasks
    const tasksDir = path.join(process.cwd(), "tasks");
    const allFiles = fs.readdirSync(tasksDir)
      .filter(f => f.endsWith(".yaml"))
      .map(f => path.join(tasksDir, f));
    for (const file of allFiles) {
      await syncTask(file);
    }
  } else {
    // Sync only specified files
    for (const file of files) {
      if (fs.existsSync(file)) {
        await syncTask(file);
      }
    }
  }
}

main().catch(err => {
  console.error("Sync failed:", err);
  process.exit(1);
});
