#!/bin/bash
echo "Starting real-time services..."
docker compose up -d postgres mongodb redis rabbitmq
echo "Waiting for services to be ready..."
sleep 10
npm run start:all
