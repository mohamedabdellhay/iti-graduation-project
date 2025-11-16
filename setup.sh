#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="hotjar-clone"
SERVICES=("api-gateway" "auth-service" "tracking-service" "analytics-service" "playback-service" "processing-service")

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   real-time - Project Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version must be 18 or higher. Current version: $(node -v)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
}

# Check if NestJS CLI is installed
check_nestjs_cli() {
    if ! command -v nest &> /dev/null; then
        echo -e "${YELLOW}⚠️  NestJS CLI not found. Installing globally...${NC}"
        npm install -g @nestjs/cli
    else
        echo -e "${GREEN}✅ NestJS CLI $(nest --version) detected${NC}"
    fi
}

# Create project structure
create_structure() {
    echo -e "\n${BLUE}📁 Creating project structure...${NC}"
    
    # Create main directories
    mkdir -p packages
    mkdir -p shared/{dto,interfaces,constants,utils,decorators,filters,guards,interceptors,pipes}
    mkdir -p init-scripts
    
    echo -e "${GREEN}✅ Project structure created${NC}"
}

# Create NestJS services
create_services() {
    echo -e "\n${BLUE}🏗️  Creating NestJS microservices...${NC}"
    
    cd packages || exit
    
    for service in "${SERVICES[@]}"; do
        if [ ! -d "$service" ]; then
            echo -e "${YELLOW}Creating $service...${NC}"
            nest new "$service" --package-manager npm --skip-git --skip-install
            
            # Update package.json name
            cd "$service" || exit
            
            # Update package name to be scoped
            sed -i.bak "s/\"name\": \"$service\"/\"name\": \"@$PROJECT_NAME\/$service\"/" package.json
            rm package.json.bak 2>/dev/null
            
            # Copy .env.example
            cp ../../.env.example .env
            
            cd ..
            echo -e "${GREEN}✅ $service created${NC}"
        else
            echo -e "${YELLOW}⚠️  $service already exists, skipping...${NC}"
        fi
    done
    
    cd ..
}

# Create shared package
create_shared_package() {
    echo -e "\n${BLUE}📦 Creating shared package...${NC}"
    
    cat > shared/package.json << 'EOF'
{
  "name": "@hotjar-clone/shared",
  "version": "1.0.0",
  "description": "Shared code between microservices",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  },
  "dependencies": {
    "@nestjs/common": "^10.2.10",
    "@nestjs/core": "^10.2.10",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.0"
  }
}
EOF

    cat > shared/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF

    cat > shared/index.ts << 'EOF'
// DTOs
export * from './dto';

// Interfaces
export * from './interfaces';

// Constants
export * from './constants';

// Utils
export * from './utils';

// Decorators
export * from './decorators';

// Filters
export * from './filters';

// Guards
export * from './guards';

// Interceptors
export * from './interceptors';

// Pipes
export * from './pipes';
EOF

    # Create index files for each directory
    for dir in dto interfaces constants utils decorators filters guards interceptors pipes; do
        echo "// Export all $dir" > "shared/$dir/index.ts"
    done
    
    echo -e "${GREEN}✅ Shared package created${NC}"
}

# Create database init scripts
create_init_scripts() {
    echo -e "\n${BLUE}💾 Creating database initialization scripts...${NC}"
    
    cat > init-scripts/01-init-databases.sql << 'EOF'
-- Create databases
CREATE DATABASE hotjar_auth;
CREATE DATABASE hotjar_analytics;

-- You can add more initialization SQL here
EOF
    
    echo -e "${GREEN}✅ Database init scripts created${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "\n${BLUE}📥 Installing dependencies (this may take a few minutes)...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Create helpful scripts
create_helper_scripts() {
    echo -e "\n${BLUE}📝 Creating helper scripts...${NC}"
    
    # Create start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting real-time services..."
docker-compose up -d postgres mongodb redis rabbitmq
echo "Waiting for services to be ready..."
sleep 10
npm run start:all
EOF
    
    chmod +x start.sh
    
    # Create stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping all services..."
docker-compose down
EOF
    
    chmod +x stop.sh
    
    echo -e "${GREEN}✅ Helper scripts created (start.sh, stop.sh)${NC}"
}

# Print next steps
print_next_steps() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}   ✅ Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    
    echo -e "${BLUE}📋 Next Steps:${NC}\n"
    echo -e "1. Configure environment variables:"
    echo -e "   ${YELLOW}cp .env.example .env${NC}"
    echo -e "   Then edit .env with your settings\n"
    
    echo -e "2. Start infrastructure services (PostgreSQL, MongoDB, Redis, RabbitMQ):"
    echo -e "   ${YELLOW}docker-compose up -d${NC}\n"
    
    echo -e "3. Run database migrations:"
    echo -e "   ${YELLOW}npm run db:migrate:auth${NC}"
    echo -e "   ${YELLOW}npm run db:migrate:analytics${NC}\n"
    
    echo -e "4. Start all microservices in development mode:"
    echo -e "   ${YELLOW}npm run start:dev${NC}\n"
    
    echo -e "   Or start services individually:"
    echo -e "   ${YELLOW}npm run start:gateway${NC}"
    echo -e "   ${YELLOW}npm run start:auth${NC}"
    echo -e "   ${YELLOW}npm run start:tracking${NC}"
    echo -e "   etc...\n"
    
    echo -e "5. Access your services:"
    echo -e "   - API Gateway:      ${BLUE}http://localhost:3000${NC}"
    echo -e "   - Auth Service:     ${BLUE}http://localhost:3001${NC}"
    echo -e "   - Tracking Service: ${BLUE}http://localhost:3002${NC}"
    echo -e "   - Analytics:        ${BLUE}http://localhost:3003${NC}"
    echo -e "   - Playback:         ${BLUE}http://localhost:3004${NC}"
    echo -e "   - Processing:       ${BLUE}http://localhost:3005${NC}"
    echo -e "   - RabbitMQ UI:      ${BLUE}http://localhost:15672${NC} (guest/guest)\n"
    
    echo -e "6. View logs:"
    echo -e "   ${YELLOW}docker-compose logs -f${NC}\n"
    
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo -e "   - Read the README.md for detailed information"
    echo -e "   - Check each service's README in packages/[service-name]\n"
    
    echo -e "${GREEN}Happy coding! 🚀${NC}\n"
}

# Main execution
main() {
    check_nodejs
    check_nestjs_cli
    create_structure
    create_services
    create_shared_package
    create_init_scripts
    install_dependencies
    create_helper_scripts
    print_next_steps
}

# Run main function
main