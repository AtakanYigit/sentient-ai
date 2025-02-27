import {DataSource} from "typeorm";
import path         from "path";
import createSubscriber from "pg-listen";

require("dotenv").config({ path: '../.env' });

interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

const isTest = process.env.NODE_ENV === "test";

const dbConfig: DatabaseConfig = {
    host:     isTest ? process.env.TEST_DB_HOST     : process.env.DB_HOST,
    user:     isTest ? process.env.TEST_DB_USER     : process.env.DB_USER,
    password: isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isTest ? process.env.TEST_DB_NAME     : process.env.DB_NAME,
    port: isTest 
        ? parseInt(process.env.TEST_DB_PORT || "5432") 
        : parseInt(process.env.DB_PORT      || "5432"),
};

export const DB = new DataSource({
    type:           "postgres",
    host:           dbConfig.host,
    port:           dbConfig.port,
    username:       dbConfig.user,
    password:       dbConfig.password,
    database:       dbConfig.database,
    synchronize:    false,
    logging:        false,
    migrationsRun:  true,
    migrations:     [path.join(__dirname, "../migrations/*.{ts,js}")],
    subscribers:    [],
    entities:       [path.join(__dirname, "../src/entities/*.{ts,js}")],
});

export const pgListener = createSubscriber({
    connectionString: `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
    retryInterval: 1000,
});