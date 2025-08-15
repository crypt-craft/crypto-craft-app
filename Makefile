dev:
	docker compose -f docker/docker-compose.dev.yml up --build -d
	docker compose -f docker/docker-compose.dev.yml logs -f

dev-down:
	docker compose -f docker/docker-compose.dev.yml down -v

prod:
	docker compose -f docker/docker-compose.prod.yml build --no-cache
	docker compose -f docker/docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker/docker-compose.prod.yml down -v


