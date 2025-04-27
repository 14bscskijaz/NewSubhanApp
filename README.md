

## Run the application
### Instructions To Run Backend API Server

1. build the API.
In the "BusServiceAPI/BusServiceAPI" directory, run the following command:
```bash
dotnet build
```

2. run the server.
```bash
dotnet run
```

### Install dotnet-ef
```bash
dotnet tool install --global dotnet-ef --version 6
```

### Other db related commands

Syncs the database with the models.
```bash
dotnet ef database update
```

To create and add migrations:
dotnet ef migrations add InitialMigration

**Note:** Risky command, drops the database.
dotnet ef database drop -f

## Deployement Instructions

### Backend

1. first ensure that database is synced with the models.
Use database update command to do that.
```bash
dotnet ef database update
```

2. Kill the old dotnet service using `kill -15 <pid>`.

3. build the updated dotnet service.

3. deploy using `nohup`.
e.g. 
```bash
nohup dotnet run &
```

#### Access Swagger docs
The API documentation can be accessed at the URL:
"<address on which the server is running>/swagger/index.html".
Add "/swagger/index.html" to the base URL of the server to access the API documentation.

## Testing

### To Run the Tests
```bash
pytest
```

Running test with different options.
```bash
pytest --headed --slowmo=2000
```

### Run tests in Debug Mode
```bash
PWDEBUG=1 pytest -s 
```

### Start Test Recording
```bash
playwright codegen --viewport-size "1880, 1000" localhost:3000
```

#### Update Playwrite
```bash
pip install pytest-playwright playwright -U
```

## Replicating Production Database


1. Create `pg_dump` of the production database.
```bash
pg_dump -U subhandb_owner -d subhandb -h localhost | gzip > subhandb_dump.sql.gz
or 
pg_dump -h localhost -U subhandb_owner -d subhandb -F custom -f 2025-04-23_subhandb.dump
```

2. Copy the dump to the local machine.
```bash
scp subhanvm:/home/subhan/webapp/NewSubhanApp/database/subhandb_dump.sql.gz .
```

3. Load the dump into the local database.
```bash
gunzip -c 16-01-2025_dumpfile.sql.gz | psql -U subhandb_owner -d subhandb_prod_rep -h localhost -p 5435
or
pg_restore -h localhost -U subhandb_owner -d accounts_test_db 2025-04-23_subhandb.dump
```
