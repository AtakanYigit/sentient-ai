console.log("Senses Layer Started");

import {DB} from "./config/database";
import axios from "axios";
import speech from "@google-cloud/speech";
import recorder from "node-record-lpcm16";

const sendActionToMemoryLayer = async (action: string) => {
    try {
        const response = await axios.post(`http://localhost:${process.env.MEMORIES_LAYER_PORT}/api/`, {action: action});

        console.log(response.data);
    } catch (error) {
        console.error("Error sending action to memory layer:", error);
    }
};

const hearAndProcess = async () => {
    // Creates a client with explicit credentials
    const client = new speech.SpeechClient({
        keyFilename: "./sentientai-451816-ef9255a68ccf.json",
    });

    // Configuration
    const encoding        = "LINEAR16";
    const sampleRateHertz = 16000;
    const languageCode    = "en-US";
    const threshold       = 0;
    const silence         = "1.0";
    const verbose         = false;


    const request = {
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        },
        interimResults: false,
    };

    // Create a recognize stream
    const recognizeStream = client
        .streamingRecognize(request as any)
        .on("error", (error) => {console.error("Error in recognition stream:", error);})
        .on("data", (data: any) => {
            if (data.results[0] && data.results[0].alternatives[0]) {
                const transcription = data.results[0].alternatives[0].transcript;
                sendActionToMemoryLayer(`I heard: ${transcription}`);
            }
        });

    // Try different recording programs
    const recordingOptions = {
        sampleRateHertz:    sampleRateHertz,
        threshold:          threshold,
        silence:            silence,
        recordProgram:      "sox",
        verbose:            verbose
    };

    try {
        console.log("Starting hearing...");
        recorder
            .record(recordingOptions)
            .stream()
            .on("error", (error) => {
                console.error("Error in recording stream:", error);
                // Try alternative recording program if first one fails
                recordingOptions.recordProgram = "sox";
                recorder
                    .record(recordingOptions)
                    .stream()
                    .on("error", (error) => {console.error("Error with alternative recording program:", error);})
                    .pipe(recognizeStream);
            })
            .pipe(recognizeStream);
    } catch (error) {
        console.error("Failed to start hearing:", error);
    }
};

const seeAndProcess = async () => {
    console.log("Starting seeing...");
    
    console.log("I have no eyes yet...");    
}

// Start the loop
const init = async () => {
    if (!DB.isInitialized) await DB.initialize();

    // Start listening
    await hearAndProcess();

    // Start Seeing
    await seeAndProcess();

    // Start Temperature Monitoring
    // await monitorTemperature();

    
    // setInterval(seeAndProcess, 30000);
};

// Initialize
init();