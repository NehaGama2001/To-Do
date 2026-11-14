

## Run locally

**Backend** (needs .NET 10 SDK) - runs on http://localhost:5000, Swagger at /swagger
```
cd backend/TodoApi
dotnet run
```

**Frontend** (needs Node 20+) - runs on http://localhost:4200
```
cd frontend
npm install
npm start
```

## Run tests locally
```
cd backend && dotnet test TodoApi.Tests/TodoApi.Tests.csproj
cd frontend && npm test
```

## CI
`.github/workflows/ci.yml` builds and tests both apps in parallel on every push / PR to `main`.
