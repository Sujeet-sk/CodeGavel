# CodeGavel

CodeGavel is a LeetCode-style online judge for Java submissions.

It accepts Java source code, queues submissions for asynchronous execution, runs code inside isolated Docker containers, evaluates output against test cases, and returns a verdict.

## Tech Stack

- Java
- Spring Boot
- MySQL
- Redis
- Spring Security
- JWT
- BCrypt
- Docker
- React
- JUnit 5

## Architecture

React
  ↓
Spring Boot REST API
  ↓
MySQL + Redis
  ↓
Worker
  ↓
Docker Sandbox
  ↓
Java Compiler / Runtime
  ↓
Verdict

## Project Structure

codegavel/
├── backend/
├── frontend/
├── infrastructure/
├── docs/
├── .gitignore
└── README.md
