<<<<<<< HEAD
# 거지맵 - 고물가 시대 극가성비 식당 모음

## 실행 방법

### 개발 환경 (로컬)

1. PostgreSQL 실행 (Docker):
```bash
docker run -d --name geojimap-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=geojimap \
  -p 5432:5432 \
  postgres:16-alpine
```

2. 백엔드 실행:
```bash
cd backend
npm install
npm run start:dev
```

3. 프론트엔드 실행:
```bash
cd frontend
npm install
npm run dev
```

4. 브라우저에서 http://localhost:3000 접속

### Docker Compose로 전체 실행
```bash
docker-compose up --build
```

## 기술 스택
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Leaflet.js
- Backend: NestJS, TypeScript, TypeORM
- Database: PostgreSQL
=======
# kwu_eats
>>>>>>> 3f7b2b887c13896e211f80c9956af5a1c63dcd9d
