.PHONY: help db-up db-down db-reset app-dev app-build logs

help: ## Показать все команды
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Docker команды ─────────────────────────────────

db-up: ## Запустить PostgreSQL в Docker
	@echo "Starting PostgreSQL..."
	docker compose up -d postgres
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	@docker compose exec postgres pg_isready -U football -d football_db
	@echo "PostgreSQL is ready on localhost:5432"

db-down: ## Остановить PostgreSQL
	docker compose down

db-reset: ## Полностью сбросить БД (удалить все данные)
	docker compose down -v
	docker compose up -d postgres
	@sleep 3
	@echo "Database reset complete"

db-logs: ## Посмотреть логи PostgreSQL
	docker compose logs -f postgres

db-shell: ## Подключиться к psql внутри контейнера
	docker compose exec postgres psql -U football -d football_db

# ─── Prisma команды ─────────────────────────────────

prisma-generate: ## Сгенерировать Prisma-клиент
	npx prisma generate --schema=src/infrastructure/database/prisma/schema.prisma

prisma-migrate: ## Запустить миграцию
	npx prisma migrate dev --name init --schema=src/infrastructure/database/prisma/schema.prisma

prisma-studio: ## Открыть Prisma Studio (GUI для БД)
	npx prisma studio --schema=src/infrastructure/database/prisma/schema.prisma

prisma-reset: ## Сбросить и пересоздать БД
	npx prisma migrate reset --schema=src/infrastructure/database/prisma/schema.prisma

# ─── Приложение ─────────────────────────────────────

app-dev: ## Запустить Next.js в dev-режиме
	npm run dev

app-build: ## Собрать приложение
	npm run build

app-start: ## Запустить собранное приложение
	npm start

# ─── Полная настройка с нуля ────────────────────────

setup: ## Полная настройка проекта с нуля
	@echo "=== 1. Installing dependencies ==="
	npm install
	@echo "=== 2. Starting PostgreSQL ==="
	docker compose up -d postgres
	@sleep 3
	@echo "=== 3. Generating Prisma client ==="
	npx prisma generate --schema=src/infrastructure/database/prisma/schema.prisma
	@echo "=== 4. Running migrations ==="
	npx prisma migrate dev --name init --schema=src/infrastructure/database/prisma/schema.prisma
	@echo "=== Setup complete! ==="
	@echo "Run 'make app-dev' to start development"

# ─── Проверка ошибок ────────────────────────────────

check: ## Проверить TypeScript на ошибки
	npx tsc --noEmit

lint: ## Запустить ESLint
	npx eslint src/ --ext .ts,.tsx

test: ## Запустить тесты
	npm test

logs: ## Посмотреть все логи
	docker compose logs -f