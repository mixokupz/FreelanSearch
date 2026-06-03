#!/bin/bash

# Root directory of the project
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ELK_DIR="$PROJECT_ROOT/elk"

start() {
    echo "Starting the application..."

    # 1. Create network if it doesn't exist
    if ! docker network inspect elk_default >/dev/null 2>&1; then
        echo "Creating network elk_default..."
        docker network create elk_default
    fi

    # 2. Start ELK stack
    echo "Starting ELK stack..."
    cd "$ELK_DIR" && docker-compose up -d

    # Wait for ELK stack to be healthy
    echo "Waiting for ELK stack to be healthy..."
    TIMEOUT=90
    COUNT=0
    while [ $COUNT -lt $TIMEOUT ]; do
        # Count containers that are either healthy OR don't have a healthcheck defined
        # We check for 'healthy' status, but we also need to account for containers without a healthcheck
        # which will just show as 'Up' without (healthy/unhealthy)
        
        # Containers that ARE explicitly unhealthy
        UNHEALTHY_COUNT=$(docker ps --filter "label=com.docker.compose.project=elk" --filter "health=unhealthy" -q | wc -l)
        
        # Critical containers that must be healthy (ES and Kibana)
        ES_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' elk_elasticsearch_1 2>/dev/null || echo "unknown")
        KIBANA_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' elk_kibana_1 2>/dev/null || echo "unknown")

        if [ "$UNHEALTHY_COUNT" -eq 0 ] && [ "$ES_HEALTH" == "healthy" ] && [ "$KIBANA_HEALTH" == "healthy" ]; then
            echo "ELK stack is healthy!"
            break
        fi

        echo -n "."
        sleep 2
        COUNT=$((COUNT + 2))
    done

    if [ $COUNT -eq $TIMEOUT ]; then
        echo -e "\nError: ELK stack failed to become healthy within ${TIMEOUT}s. Stopping startup."
        # Optional: stop what was started to avoid leaving unhealthy containers
        cd "$ELK_DIR" && docker-compose down
        exit 1
    fi
    echo -e "\n"

    # 3. Start main services
    echo "Starting main services..."
    cd "$PROJECT_ROOT" && docker-compose up -d --build

    echo "Application started successfully!"
    echo "Frontend: http://localhost:5173"
    echo "Kibana: http://localhost:5601"
}

stop() {
    echo "Stopping the application..."

    # 1. Stop main services
    cd "$PROJECT_ROOT" && docker-compose down

    # 2. Stop ELK stack
    cd "$ELK_DIR" && docker-compose down

    echo "Application stopped successfully!"
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac
