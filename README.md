
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

#### Access Swagger docs
The API documentation can be accessed at the URL:
"<address on which the server is running>/swagger/index.html".
Add "/swagger/index.html" to the base URL of the server to access the API documentation.