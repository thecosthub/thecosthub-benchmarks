import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaPath = path.join(process.cwd(), "schemas", "task-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);

const tasksDir = path.join(process.cwd(), "tasks");
const taskFiles = fs.readdirSync(tasksDir).filter(f => f.endsWith(".yaml"));

let failures = 0;

for (const file of taskFiles) {
  const content = fs.readFileSync(path.join(tasksDir, file), "utf-8");
  const data = yaml.parse(content);

  const valid = validate(data);
  if (valid) {
    console.log(`✅ ${file} — valid`);
  } else {
    console.error(`❌ ${file} — invalid:`);
    for (const err of validate.errors || []) {
      console.error(`   ${err.instancePath} ${err.message}`);
    }
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} file(s) failed schema validation`);
  process.exit(1);
} else {
  console.log(`\n✅ All ${taskFiles.length} task file(s) pass schema validation`);
}
