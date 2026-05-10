import { Client, Account, Databases, Storage, ID, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.1/+esm";

const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("69fec2ae0012dadf853f");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Ping the Appwrite backend server to verify the setup
client.ping();

export { client, account, databases, storage, ID, Query };
