# Analytics & Session Recording Platform

A powerful, scalable analytics platform, built with NestJS microservices architecture. Track user behavior, record sessions, generate heatmaps, and gain insights into how users interact with your website.

## 🚀 Features

- **Session Recording**: Capture and replay user sessions with mouse movements, clicks, and scrolls
- **Heatmaps**: Visualize user interactions with click, scroll, and move heatmaps
- **Analytics Dashboard**: Real-time insights on visitors, page views, bounce rates, and user flows
- **User Feedback**: Surveys, polls, and feedback widgets
- **Multi-tenant**: Support for multiple projects/websites per user
- **Scalable Architecture**: Microservices-based design for high performance

## 🏗️ Architecture

The platform consists of 6 microservices:

```
┌─────────────────────────────────────────────────────┐
│                  API Gateway (3000)                  │
│              (Single Entry Point)                    │
└────┬────────┬────────┬────────┬────────┬────────────┘
     │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼
┌─────────┐ ┌──────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐
│  Auth   │ │Track │ │Analytics│ │ Playback │ │Processing│
│ Service │ │Service│ │ Service │ │ Service  │ │ Service  │
│ (3001)  │ │(3002)│ │ (3003)  │ │ (3004)   │ │ (3005)   │
└─────────┘ └──────┘ └─────────┘ └──────────┘ └─────────┘
```

### Services Overview

| Service                | Port | Responsibility                                          |
| ---------------------- | ---- | ------------------------------------------------------- |
| **API Gateway**        | 3000 | Request routing, load balancing, rate limiting          |
| **Auth Service**       | 3001 | User authentication, authorization, project management  |
| **Tracking Service**   | 3002 | Event ingestion from tracking scripts                   |
| **Analytics Service**  | 3003 | Metrics calculation, reports, real-time analytics       |
| **Playback Service**   | 3004 | Session replay, heatmap data retrieval                  |
| **Processing Service** | 3005 | Event processing, heatmap calculation, data aggregation |

## 🛠️ Tech Stack

### Backend

- **NestJS** - Node.js framework for building microservices
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational data (users, projects, analytics summaries)
- **MongoDB** - Document storage (events, sessions)
- **Redis** - Caching and rate limiting
- **RabbitMQ** - Message queue for async communication
- **Docker** - Containerization

### Communication

- **TCP/gRPC** - Synchronous communication between services
- **RabbitMQ** - Asynchronous event-driven communication
- **WebSockets** - Real-time updates

### Infrastructure

- **AWS S3** - Session recording storage (optional)
- **CDN** - Tracking script distribution

## 📋 Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+
- RabbitMQ 3+

## 🚀 Getting Started

### 1. Clone the repository

```bash
git https://github.com/mohamedabdellhay/iti-graduation-project
cd iti-graduation-project
```

### 2. Setup environment variables

Copy the `.env.example` to `.env` in each service directory and configure:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section below for details.

### 3. Install dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for all services
npm run install:all
```

### 4. Start infrastructure services

```bash
docker-compose up -d postgres mongodb redis rabbitmq
```

Wait for all services to be healthy:

```bash
docker-compose ps
```

### 5. Run database migrations

```bash
# Auth Service (PostgreSQL)
npm run migrate:auth

# Analytics Service (PostgreSQL)
npm run migrate:analytics
```

### 6. Start all microservices

```bash
# Development mode with hot reload
npm run start:dev

# Or start services individually
npm run start:dev:gateway
npm run start:dev:auth
npm run start:dev:tracking
npm run start:dev:analytics
npm run start:dev:playback
npm run start:dev:processing
```

### 7. Verify services are running

- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Tracking Service: http://localhost:3002
- Analytics Service: http://localhost:3003
- Playback Service: http://localhost:3004
- Processing Service: http://localhost:3005
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## 📚 API Documentation

Once services are running, access the API documentation:

- API Gateway Swagger: http://localhost:3000/api
- Auth Service Swagger: http://localhost:3001/api
- Analytics Service Swagger: http://localhost:3003/api
- Playback Service Swagger: http://localhost:3004/api

## 🔑 Environment Variables

### API Gateway (.env)

```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Service URLs
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
TRACKING_SERVICE_HOST=localhost
TRACKING_SERVICE_PORT=3002
ANALYTICS_SERVICE_HOST=localhost
ANALYTICS_SERVICE_PORT=3003
PLAYBACK_SERVICE_HOST=localhost
PLAYBACK_SERVICE_PORT=3004

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGINS=http://localhost:3001,http://localhost:4200
```

### Auth Service (.env)

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=real-time_auth
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Tracking Service (.env)

```env
# Server
NODE_ENV=development
PORT=3002

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_QUEUE_EVENTS=events.raw

# Rate Limiting
MAX_EVENTS_PER_SECOND=1000
MAX_EVENTS_PER_PROJECT=10000
```

### Analytics Service (.env)

```env
# Server
NODE_ENV=development
PORT=3003

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=real_time_analytics
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# MongoDB
MONGODB_URI=mongodb://localhost:27017/real_time_analytics

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Playback Service (.env)

```env
# Server
NODE_ENV=development
PORT=3004

# MongoDB
MONGODB_URI=mongodb://localhost:27017/real_time_events

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL=3600

# AWS S3 (Optional - for storing recordings)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=real-time-recordings
```

### Processing Service (.env)

```env
# Server
NODE_ENV=development
PORT=3005

# MongoDB
MONGODB_URI=mongodb://localhost:27017/real_time_events

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_QUEUE_EVENTS=events.raw
RABBITMQ_QUEUE_HEATMAP=heatmap.calculate
RABBITMQ_QUEUE_ANALYTICS=analytics.aggregate

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Processing Configuration
BATCH_SIZE=100
PROCESSING_INTERVAL=5000
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test specific service
npm run test:auth
npm run test:tracking
```

## 📦 Project Structure

```
iti-graduation-project/
├── api-gateway/              # API Gateway service
│   ├── src/
│   ├── test/
│   └── package.json
├── auth-service/             # Authentication service
│   ├── src/
│   ├── test/
│   └── package.json
├── tracking-service/         # Event tracking service
│   ├── src/
│   ├── test/
│   └── package.json
├── analytics-service/        # Analytics service
│   ├── src/
│   ├── test/
│   └── package.json
├── playback-service/         # Session playback service
│   ├── src/
│   ├── test/
│   └── package.json
├── processing-service/       # Background processing service
│   ├── src/
│   ├── test/
│   └── package.json
├── shared/                   # Shared code between services
│   ├── dto/
│   ├── interfaces/
│   ├── constants/
│   └── utils/
├── tracking-script/          # Client-side tracking script
│   └── src/
├── docker-compose.yml        # Docker services configuration
├── .env.example             # Environment variables template
├── .gitignore
├── package.json             # Root package.json (workspace)
└── README.md
```

## 🔐 Security

- JWT-based authentication
- API key validation for tracking endpoints
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Environment-based secrets

## 📈 Performance Optimization

- Redis caching for frequently accessed data
- Database query optimization with indexes
- Event batching in tracking script
- Async processing with RabbitMQ
- Connection pooling
- Data compression

## 🚢 Deployment

### Docker Production Build

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (Optional)

Kubernetes manifests are available in the `/k8s` directory:

```bash
kubectl apply -f k8s/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by [Hotjar](https://www.hotjar.com/)
- Built with [NestJS](https://nestjs.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For support, email support@yourapp.com or join our Slack channel.

## 🗺️ Roadmap

- [x] Basic session recording
- [x] Click heatmaps
- [x] Scroll heatmaps
- [ ] Move heatmaps
- [ ] Funnel analysis
- [ ] A/B testing integration
- [ ] User feedback widgets
- [ ] Mobile app support
- [ ] Advanced filtering
- [ ] Team collaboration features
- [ ] White-label solution

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
