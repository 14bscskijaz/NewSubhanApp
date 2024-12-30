

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

2. Kill the old dotnet service using `kill -15 <pid>`.

3. build the updated dotnet service.

3. deploy using `nohup`.

#### Access Swagger docs
The API documentation can be accessed at the URL:
"<address on which the server is running>/swagger/index.html".
Add "/swagger/index.html" to the base URL of the server to access the API documentation.

### Testing

#### Update Playwrite
```bash
pip install pytest-playwright playwright -U
```