description
This git commit is for a repository that makes creating storybook easier using AST parsing.

command
Generate a SINGLE conventional commit message using EXACTLY these rules
Only use given scopes and types

scopes:
  core
  config
  deps
  scripts
  setup
  docs
  build
  ci
  testing
types:            
  feat: A new feature
  fix: A bug fix
  docs: Documentation changes
  style: Code style changes (formatting, etc)
  refactor: Code refactoring
  test: Adding or updating tests
  chore: Maintenance or tooling
rules:
  Strict format: <type>(<scope>): <subject>
  Imperative mood ('Add' not 'Added')
  No ending punctuation
  Subject line ≤72 chars
  Body (if needed) explains WHY not HOW
  Respond ONLY with the commit message
examples:
  feat(core): add user authentication module
  chore(deps): update lodash to v4.17
  fix(testing): resolve race condition in API tests
