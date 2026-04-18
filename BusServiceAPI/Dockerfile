# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project manifests first to leverage layer caching
COPY BusServiceAPI.sln global.json ./
COPY BusServiceAPI/BusServiceAPI.csproj BusServiceAPI/

RUN dotnet restore BusServiceAPI/BusServiceAPI.csproj

# Copy the rest of the source
COPY BusServiceAPI/ BusServiceAPI/

RUN dotnet publish BusServiceAPI/BusServiceAPI.csproj \
    -c Release \
    -o /app/publish

# ─── Runtime Stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Listen on HTTP only; TLS termination is handled by the reverse proxy
ENV ASPNETCORE_URLS=http://+:7169
EXPOSE 7169

ENTRYPOINT ["dotnet", "BusServiceAPI.dll"]
