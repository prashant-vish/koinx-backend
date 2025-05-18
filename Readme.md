Cryptocurrency Statistics System - Setup & Usage Guide
This system consists of two Node.js servers that work together to collect, store, and provide cryptocurrency statistics.

Prerequisites
Node.js (v14 or later)
MongoDB
NATS Server
Installation
1. Clone the repository and set up dependencies
bash
# Clone repository (if applicable)
git clone <repository-url>
cd crypto-stats

# Install dependencies for API server
cd api-server
npm install

# Install dependencies for Worker server
cd ../worker-server
npm install
2. Set up MongoDB
Make sure MongoDB is running on your system. You can download and install MongoDB from mongodb.com.

3. Set up NATS Server
Install and run NATS server:

bash
# Using Docker
docker run -p 4222:4222 -p 8222:8222 nats

# Or download and run the NATS server from https://nats.io/download/
4. Configure Environment Variables
Update the .env files in both api-server and worker-server directories to match your environment:

MONGO_URI=your Uri
COINGECKO_API="https://api.coingecko.com/api/v3/coins/markets"
NATS_SERVER="nats://localhost:4222"

Running the System
Start both servers in separate terminal windows:

1. Start the API Server
bash
cd api-server
npm start
2. Start the Worker Server
bash
cd worker-server
npm start
System Architecture
API Server
Provides REST API endpoints for cryptocurrency statistics
Subscribes to NATS events to trigger data fetching
Stores data in MongoDB
Worker Server
Runs a background job every 15 minutes
Publishes update events to NATS
Triggers the API server to fetch and store new cryptocurrency data
API Endpoints
1. Get Latest Statistics
Endpoint: GET /api/stats

Request Params:

json
{
  "coin": "bitcoin"  // Can be "bitcoin", "ethereum", or "matic-network"
}
Response:

json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
2. Get Standard Deviation
Endpoint: GET /api/deviation

Request Params:

json
{
  "coin": "bitcoin"  // Can be "bitcoin", "ethereum", or "matic-network"
}
Response:

json
{
  "deviation": 4082.48
}
Flow of Data
The Worker Server runs a job every 15 minutes
It publishes an update event to NATS
The API Server receives this event and fetches new cryptocurrency data from CoinGecko
The API Server stores this data in MongoDB
Users can query the latest statistics or the standard deviation through the API endpoints
Notes
The system stores data for three cryptocurrencies: Bitcoin, Ethereum, and Polygon (MATIC)
The standard deviation calculation uses the last 100 records for the requested cryptocurrency
All API requests and responses use JSON format
