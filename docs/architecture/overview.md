# CodeGavel Architecture

## 1. Overview

CodeGavel is a LeetCode-style online judge for Java submissions.

The system accepts Java source code from an authenticated user, places the submission into a queue, executes it inside an isolated Docker container, evaluates the output against predefined test cases, and stores the resulting verdict.

## 2. Technology Stack

- Backend: Spring Boot
- Language: Java
- Database: MySQL
- Queue: Redis
- Authentication: Spring Security + JWT
- Password hashing: BCrypt
- Code execution: Docker
- Frontend: React
- API testing: Postman / curl
- Testing: JUnit 5

## 3. High-Level Flow

1. The user logs in through the React frontend.
2. React sends the Java submission to the Spring Boot API with a JWT.
3. Spring Boot validates the request and stores the submission with status `PENDING`.
4. The submission ID is pushed into a Redis queue.
5. A worker retrieves the submission ID from Redis.
6. The worker sends the submission to an isolated Docker container.
7. The container compiles and executes the Java program against the problem's test cases.
8. The judge compares the program output with the expected output.
9. The worker updates the submission with the final verdict.
10. React polls the submission status and displays the result.

## 4. Architecture

```text
                    +----------------+
                    |  React Client  |
                    +-------+--------+
                            |
                            | HTTP/REST + JWT
                            v
                    +----------------+
                    |  Spring Boot   |
                    |      API       |
                    +---+--------+---+
                        |        |
                  save  |        | enqueue
                        |        |
                        v        v
                   +---------+  +---------+
                   |  MySQL  |  |  Redis  |
                   +---------+  +----+----+
                                    |
                                    | submission ID
                                    v
                              +-----------+
                              |  Worker   |
                              +-----+-----+
                                    |
                                    v
                            +---------------+
                            | Docker Sandbox|
                            |               |
                            | javac + java  |
                            +-------+-------+
                                    |
                                    v
                               Verdict
                                    |
                                    v
                                 MySQL
cat > docs/database-design.md <<'EOF'
# CodeGavel Database Design

## Entities

### User
- id
- username
- email
- password_hash
- created_at

### Problem
- id
- title
- description
- difficulty
- created_at

### TestCase
- id
- problem_id
- input_data
- expected_output
- time_limit_ms

### Submission
- id
- user_id
- problem_id
- source_code
- status
- execution_time_ms
- created_at
- completed_at

## Relationships

User 1:N Submission

Problem 1:N TestCase

Problem 1:N Submission
