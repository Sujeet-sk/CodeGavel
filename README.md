<div align="center">

# ⚖️ CodeGavel

**Build the skills that build your tomorrow.**

A coding practice platform built around a secure, real-time online judge. Write your solution in the browser, submit it, and get a verdict from an isolated execution pipeline.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## About CodeGavel

CodeGavel is a platform for students and developers who want to get better at problem solving. It pairs a focused coding workspace with an online judge that compiles, runs and evaluates every submission automatically.

The judge was designed and built from the ground up for this project: queueing, sandboxing, evaluation and verdicts are all part of the CodeGavel codebase. The interface carries its own identity too, with a dark technical theme, cyan and violet accents, and an animated gavel mark.

> **Current status:** the core platform is complete and verified end to end in a local environment. Hosted deployment and the full problem library are on the way (see the [Roadmap](#roadmap)).

## Language Support

| Language | Status |
| --- | --- |
| Java | Available |
| C++ | Upcoming |
| Python | Upcoming |

## Features

**Practice**
- Browser-based code editor powered by Monaco, with Run and Submit actions and a keyboard shortcut to submit
- Problem pages with the statement, difficulty and sample information
- A dashboard, problem list, submission history, profile and settings

**Judging**
- Automatic compilation, execution and output comparison against stored test cases
- Clear verdicts: `ACCEPTED`, `WRONG_ANSWER`, `COMPILATION_ERROR`, `RUNTIME_ERROR`, `TIME_LIMIT_EXCEEDED` and `SYSTEM_ERROR`
- Execution time recorded for every submission
- Asynchronous processing, so submitting never blocks on running code

**Security**
- Every submission runs inside a locked-down Docker container
- Registration and login with BCrypt password hashing and JWT-protected APIs

**Experience**
- Responsive layout that works on desktop and smaller screens
- Custom animated gavel logo with reduced-motion support

## How It Works

```text
React Frontend
      │
      ▼
Spring Boot REST API ──► MySQL   (users, problems, test cases, submissions)
      │
      ▼
Redis Queue
      │
      ▼
Background Submission Worker
      │
      ▼
Docker Execution Sandbox  (codegavel-java:21)
      │
      ▼
Compile → Run → Compare Output
      │
      ▼
Verdict saved to MySQL → shown in the frontend
```

### The life of a submission

1. A signed-in user submits code for a problem.
2. The API validates the problem, saves the submission as `PENDING` and pushes its ID onto the Redis queue.
3. A background worker picks it up and marks it `RUNNING`.
4. The judge writes the code to `Main.java` in an isolated temporary directory.
5. The code is compiled inside a Docker container.
6. Each test case input is supplied through a temporary file, and the program runs inside the sandbox.
7. The actual output is compared with the expected output.
8. The verdict and execution time are saved, and the result appears in the interface.

```text
PENDING ──► RUNNING ──► ACCEPTED
                    ├─► WRONG_ANSWER
                    ├─► COMPILATION_ERROR
                    ├─► RUNTIME_ERROR
                    ├─► TIME_LIMIT_EXCEEDED
                    └─► SYSTEM_ERROR
```

### Verdicts

| Verdict | Meaning |
| --- | --- |
| `ACCEPTED` | The output matched the expected output |
| `WRONG_ANSWER` | The program ran, but the output did not match |
| `COMPILATION_ERROR` | The source code failed to compile |
| `RUNTIME_ERROR` | The program crashed or exited abnormally |
| `TIME_LIMIT_EXCEEDED` | The program ran past the allowed time |
| `SYSTEM_ERROR` | An internal judge or infrastructure failure, not caused by the submitted code |

## Security Model

Submitted code is untrusted, so it never runs directly on the host. Each submission runs in the custom `codegavel-java:21` image with:

- **No network access** (`--network=none`)
- **Memory, CPU and process limits** to contain runaway programs
- **Dropped Linux capabilities** and `no-new-privileges`
- **A temporary filesystem** for `/tmp`
- **A non-root runner user** inside the container

On the API side, access is protected by Spring Security, a custom JWT authentication filter and BCrypt-hashed passwords.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Security, JWT, BCrypt, Maven |
| **Data** | MySQL, Redis |
| **Frontend** | React, Vite, React Router, Monaco Editor |
| **Infrastructure** | Docker, custom Java 21 execution image |

## Project Structure

```text
codegavel/
├── backend/           Spring Boot application (API, judge, queue worker)
├── frontend/          React + Vite client
├── infrastructure/    Docker and environment setup
├── docs/
│   ├── architecture/  Architecture and database design
│   └── api/           API design and verdict documentation
└── README.md
```

## Getting Started

### Prerequisites

- Java 21
- Maven
- Node.js and npm
- MySQL
- Redis
- Docker

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/Sujeet-sk/CodeGavel.git
cd CodeGavel

# 2. Build the judge image used to run submissions
docker build -t codegavel-java:21 <path-to-judge-dockerfile-directory>

# 3. Configure the backend
#    Set your MySQL, Redis and JWT secret values in the backend configuration
#    (keep secrets out of version control)

# 4. Start the backend
cd backend
mvn spring-boot:run

# 5. Start the frontend (in a second terminal)
cd frontend
npm install
npm run dev
```

> MySQL, Redis and Docker need to be running before you start the backend.

## Roadmap

Planned for upcoming releases. None of this is part of the current build.

- [ ] A curated library of original CodeGavel problems
- [ ] Problems organized by DSA pattern and concept
- [ ] Hints and explanations
- [ ] C++ and Python support
- [ ] More detailed progress analytics
- [ ] Contests
- [ ] Hosted production deployment

## License

CodeGavel is a proprietary project. This repository is public for portfolio and demonstration purposes only. All rights are reserved, and the code may not be copied, redistributed or reused without permission.

## Author

**Sujeet Kumar**
[GitHub](https://github.com/Sujeet-sk) · [LinkedIn](https://www.linkedin.com/in/sujeet-kumar-55659a289)
