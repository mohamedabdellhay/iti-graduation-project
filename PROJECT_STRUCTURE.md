# Project Structure Guide

## 📁 Complete Directory Structure

```
real-time/
│
├── packages/                           # All microservices
│   ├── api-gateway/                   # API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── config/
│   │   │   │   ├── microservices.config.ts
│   │   │   │   └── cors.config.ts
│   │   │   ├── filters/
│   │   │   │   └── rpc-exception.filter.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── timeout.interceptor.ts
│   │   │   └── middleware/
│   │   │       └── rate-limit.middleware.ts
│   │   ├── test/
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── Dockerfile
│   │
│   ├── auth-service/                  # Auth Service (Port 3001)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── guards/
│   │   │   │   │   └── jwt-auth.guard.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       ├── register.dto.ts
│   │   │   │       └── refresh-token.dto.ts
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-user.dto.ts
│   │   │   │       └── update-user.dto.ts
│   │   │   ├── projects/
│   │   │   │   ├── projects.module.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── project.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-project.dto.ts
│   │   │   │       └── update-project.dto.ts
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   └── migrations/
│   │   │   └── config/
│   │   │       ├── database.config.ts
│   │   │       └── jwt.config.ts
│   │   ├── test/
│   │   ├── .env
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── tracking-service/              # Tracking Service (Port 3002)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── tracking/
│   │   │   │   ├── tracking.module.ts
│   │   │   │   ├── tracking.controller.ts
│   │   │   │   ├── tracking.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── base-event.dto.ts
│   │   │   │       ├── click-event.dto.ts
│   │   │   │       ├── scroll-event.dto.ts
│   │   │   │       ├── mousemove-event.dto.ts
│   │   │   │       └── pageview-event.dto.ts
│   │   │   ├── validation/
│   │   │   │   ├── event-validator.service.ts
│   │   │   │   └── schemas/
│   │   │   ├── queue/
│   │   │   │   ├── queue.module.ts
│   │   │   │   └── events-queue.service.ts
│   │   │   ├── redis/
│   │   │   │   └── redis.module.ts
│   │   │   └── config/
│   │   │       ├── redis.config.ts
│   │   │       └── rabbitmq.config.ts
│   │   ├── test/
│   │   ├── .env
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── analytics-service/             # Analytics Service (Port 3003)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.module.ts
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── get-stats.dto.ts
│   │   │   │       └── analytics-query.dto.ts
│   │   │   ├── reports/
│   │   │   │   ├── reports.module.ts
│   │   │   │   ├── reports.service.ts
│   │   │   │   └── generators/
│   │   │   │       ├── pdf-generator.ts
│   │   │   │       └── csv-generator.ts
│   │   │   ├── aggregations/
│   │   │   │   ├── aggregation.service.ts
│   │   │   │   └── calculators/
│   │   │   ├── database/
│   │   │   │   ├── postgres.module.ts
│   │   │   │   └── mongodb.module.ts
│   │   │   └── entities/
│   │   │       ├── analytics-daily.entity.ts
│   │   │       └── analytics-summary.entity.ts
│   │   ├── test/
│   │   ├── .env
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── playback-service/              # Playback Service (Port 3004)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── sessions/
│   │   │   │   ├── sessions.module.ts
│   │   │   │   ├── sessions.controller.ts
│   │   │   │   ├── sessions.service.ts
│   │   │   │   ├── schemas/
│   │   │   │   │   └── session.schema.ts
│   │   │   │   └── dto/
│   │   │   │       ├── session-query.dto.ts
│   │   │   │       └── session-filter.dto.ts
│   │   │   ├── heatmaps/
│   │   │   │   ├── heatmaps.module.ts
│   │   │   │   ├── heatmaps.controller.ts
│   │   │   │   ├── heatmaps.service.ts
│   │   │   │   ├── schemas/
│   │   │   │   │   └── heatmap.schema.ts
│   │   │   │   └── dto/
│   │   │   │       └── heatmap-query.dto.ts
│   │   │   ├── streaming/
│   │   │   │   └── stream.service.ts
│   │   │   ├── mongodb/
│   │   │   │   └── mongodb.module.ts
│   │   │   ├── redis/
│   │   │   │   └── redis.module.ts
│   │   │   └── s3/
│   │   │       └── s3.module.ts
│   │   ├── test/
│   │   ├── .env
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── processing-service/            # Processing Service (Port 3005)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── processors/
│       │   │   ├── events.processor.ts
│       │   │   ├── heatmap.processor.ts
│       │   │   ├── session.processor.ts
│       │   │   └── analytics.processor.ts
│       │   ├── services/
│       │   │   ├── event-processing.service.ts
│       │   │   ├── heatmap-calculation.service.ts
│       │   │   ├── session-aggregation.service.ts
│       │   │   └── data-storage.service.ts
│       │   ├── mongodb/
│       │   │   ├── mongodb.module.ts
│       │   │   └── schemas/
│       │   │       ├── event.schema.ts
│       │   │       └── session.schema.ts
│       │   ├── rabbitmq/
│       │   │   └── rabbitmq.module.ts
│       │   └── config/
│       │       ├── mongodb.config.ts
│       │       └── rabbitmq.config.ts
│       ├── test/
│       ├── .env
│       ├── package.json
│       └── Dockerfile
│
├── shared/                            # Shared code across all services
│   ├── dto/                           # Data Transfer Objects
│   │   ├── index.ts
│   │   ├── pagination.dto.ts
│   │   └── response.dto.ts
│   ├── interfaces/                    # TypeScript interfaces
│   │   ├── index.ts
│   │   ├── event.interface.ts
│   │   ├── session.interface.ts
│   │   └── user.interface.ts
│   ├── constants/                     # Constants & Enums
│   │   ├── index.ts
│   │   ├── event-types.ts
│   │   └── error-codes.ts
│   ├── utils/                         # Utility functions
│   │   ├── index.ts
│   │   ├── date.utils.ts
│   │   └── validation.utils.ts
│   ├── decorators/                    # Custom decorators
│   │   ├── index.ts
│   │   └── current-user.decorator.ts
│   ├── filters/                       # Exception filters
│   │   ├── index.ts
│   │   └── http-exception.filter.ts
│   ├── guards/                        # Guards
│   │   ├── index.ts
│   │   └── roles.guard.ts
│   ├── interceptors/                  # Interceptors
│   │   ├── index.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/                         # Custom pipes
│   │   ├── index.ts
│   │   └── validation.pipe.ts
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── tracking-script/                   # Client-side tracking JavaScript
│   ├── src/
│   │   ├── index.ts
│   │   ├── tracker.ts
│   │   ├── event-collector.ts
│   │   ├── session-manager.ts
│   │   └── config.ts
│   ├── dist/
│   ├── package.json
│   └── webpack.config.js
│
├── init-scripts/                      # Database initialization scripts
│   └── 01-init-databases.sql
│
├── docs/                              # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── .github/                           # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml                 # Docker services configuration
├── docker-compose.prod.yml            # Production Docker config
├── .env                               # Environment variables
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
├── .prettierrc                        # Prettier configuration
├── .eslintrc.js                       # ESLint configuration
├── package.json                       # Root package.json (workspace)
├── tsconfig.json                      # Root TypeScript config
├── nest-cli.json                      # NestJS CLI configuration
├── README.md                          # Main documentation
├── CONTRIBUTING.md                    # Contribution guidelines
├── LICENSE                            # License file
├── setup.sh                           # Setup script
├── start.sh                           # Start script
└── stop.sh                            # Stop script
```

## 🚀 Service Responsibilities

### API Gateway (3000)
- Single entry point for all client requests
- Route requests to appropriate microservices
- Authentication middleware
- Rate limiting
- Load balancing

### Auth Service (3001)
- User registration & login
- JWT token generation & validation
- User management
- Project/Website management
- Role-based access control

### Tracking Service (3002)
- Receive events from tracking script
- Validate & sanitize incoming data
- Rate limiting per project
- Push events to RabbitMQ queue
- Real-time event processing

### Analytics Service (3003)
- Calculate statistics & metrics
- Generate reports
- Dashboard data aggregation
- Real-time analytics
- Data export (CSV, JSON, PDF)

### Playback Service (3004)
- Retrieve session recordings
- Stream session data
- Fetch heatmap data
- Filter & search sessions
- Session replay rendering

### Processing Service (3005)
- Consume events from RabbitMQ
- Process & transform events
- Calculate heatmaps
- Aggregate sessions
- Store processed data in MongoDB

## 📦 Shared Package

The `shared/` directory contains code that is used across multiple services:

- **DTOs**: Reusable data transfer objects
- **Interfaces**: TypeScript type definitions
- **Constants**: Shared constants and enums
- **Utils**: Common utility functions
- **Decorators**: Custom NestJS decorators
- **Filters**: Exception filters
- **Guards**: Authentication/Authorization guards
- **Interceptors**: Request/Response interceptors
- **Pipes**: Validation pipes

## 🗄️ Database Schema

### PostgreSQL (Auth & Analytics)

**auth database:**
- users
- projects
- refresh_tokens

**analytics database:**
- analytics_daily
- analytics_summary
- user_flows

### MongoDB (Events & Sessions)

**Collections:**
- events
- sessions
- heatmaps

## 🔄 Communication Flow

```
Client/Website
    ↓
Tracking Script
    ↓
API Gateway (3000)
    ↓
Tracking Service (3002)
    ↓
RabbitMQ Queue
    ↓
Processing Service (3005)
    ↓
MongoDB (Storage)
    ↓
Playback Service (3004) / Analytics Service (3003)
    ↓
API Gateway (3000)
    ↓
Client Dashboard
```

## 📝 Notes

- Each service has its own `package.json`, `tsconfig.json`, and `.env`
- Services communicate via TCP (for synchronous) or RabbitMQ (for asynchronous)
- Shared code is imported using `@real-time/shared`
- Docker Compose manages all infrastructure services
- Each service can be deployed independently