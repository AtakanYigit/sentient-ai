import {exec} from "child_process";
import fs     from "fs";
import path   from "path";
import util   from "util";

const execPromise = util.promisify(exec);
const childProcesses: { [key: string]: any } = {};

const directories: string[] = fs.readdirSync("./").filter(file => 
    fs.statSync(path.join("./", file)).isDirectory() && 
    file.includes("Layer")
);

async function runCommand(command: string, cwd: string, directory: string): Promise<void> {
    try {
        const childProcess = exec(command, { cwd });
        childProcesses[directory] = childProcess;

        childProcess.stdout?.on("data", (data) => {
            console.log(`[${directory}] ${data}`);
        });

        childProcess.stderr?.on("data", (data) => {
            console.error(`[${directory}] Error: ${data}`);
        });
    } catch (error) {
        console.error(`Error executing command in ${cwd}:`, error.message);
    }
}

async function setupAndRunDirectory(directory: string): Promise<void> {
    const dirPath: string = path.join("./", directory);
    console.log(`\n📂 Setting up ${directory}...`);

    // Install dependencies (Keeps restarting the server due to changes in the dependencies)
    // console.log("Installing dependencies...");
    // await execPromise("npm install", { cwd: dirPath });

    // Run TypeScript file directly using ts-node
    console.log(`🚀 Starting ${directory}...`);
    await runCommand("npm run dev ", dirPath, directory);
}

function cleanup() {
    console.log("\n🛑 Shutting down all layers...");
    Object.values(childProcesses).forEach(process => {
        process.kill();
    });
    process.exit(0);
}

async function main(): Promise<void> {
    console.log("🚀 Starting all layers...\n");
    
    // Handle graceful shutdown
    process.on("SIGINT", cleanup);  // Ctrl+C
    process.on("SIGTERM", cleanup); // Kill command

    await Promise.all(directories.map(setupAndRunDirectory));
}

main().catch(console.error);