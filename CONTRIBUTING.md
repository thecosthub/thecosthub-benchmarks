# Contributing to TheCostHub Benchmarks

Thank you for contributing to open, verifiable unit economics for knowledge work!

## Submission Guidelines

1. **Fork the repository** and create a branch for your task: `git checkout -b task/my-new-task`.
2. **Add a task YAML file** under `tasks/<benchmark-id>.yaml` following the schema in `schemas/task-schema.json`.
3. **Run local validation**:
   ```bash
   npm install
   npm run validate
   npm run verify
   ```
4. **Open a Pull Request**:
   - Our automated CI will run schema validation, human baseline checks, and model token measurements.
   - A maintainer will review the PR, verify the methodology, and merge.
   - Once merged, the data automatically synchronizes to the production leaderboard.

## Code of Conduct

Please treat all community members with respect. Constructive critique and transparent methodology debates are strongly encouraged.
