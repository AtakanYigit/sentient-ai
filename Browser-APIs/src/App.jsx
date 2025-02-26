import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const videoRef  = useRef(null);
    const canvasRef = useRef(null);
    const [error,           setError]          = useState(null);
    const [devices,         setDevices]        = useState([]);
    const [selectedDevice,  setSelectedDevice] = useState("");
    const [isCapturing,     setIsCapturing]    = useState(false);
    
    useEffect(() => {
        // Get list of available video devices
        const getVideoDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === "videoinput");
                setDevices(videoDevices);
                
                // Select first device by default
                if (videoDevices.length > 0 && !selectedDevice) {
                    setSelectedDevice(videoDevices[0].deviceId);
                }
            } catch (err) {
                setError("Error getting camera devices: " + err.message);
            }
        };

        getVideoDevices();
    }, []);

    useEffect(() => {
        const handleStartCamera = async () => {
            if (!selectedDevice) return;

            try {
                if (videoRef.current?.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }

                // Try with minimal constraints first
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: selectedDevice }
                    }
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error details:", err);
                setError(`Camera access failed: ${err.message}. Please ensure:
                    1. Your browser has camera permissions
                    2. No other app is using the camera
                    3. Your device has a working camera`
                );
            }
        };

        handleStartCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [selectedDevice]);

    useEffect(() => {
        if (!videoRef.current || isCapturing || error) return;

        const captureAndSend = async () => {
            try {
                console.log("captureAndSend");
                // Create canvas if it doesn't exist
                if (!canvasRef.current) {
                    canvasRef.current = document.createElement("canvas");
                }
                
                const video = videoRef.current;
                const canvas = canvasRef.current;
                
                // Set canvas size to match video dimensions
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Draw current video frame to canvas
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Convert canvas to blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
                
                // Create form data and append blob
                const formData = new FormData();
                formData.append("image", blob);
                
                // Send to server
                await axios.post("http://localhost:8085/api/senses", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }).then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.error("Screenshot error:", error);
                });
            } catch (err) {
                console.error("Screenshot error:", err);
            }
        };

        // Start capturing once video is playing
        const handleVideoPlay = () => {
            setIsCapturing(true);
        };
        
        videoRef.current.addEventListener("playing", handleVideoPlay);
        
        // Set up interval for captures
        const photoCaptureInterval = setInterval(captureAndSend, 30000); // 30 seconds
        captureAndSend();

        return () => {
            videoRef.current?.removeEventListener("playing", handleVideoPlay);
            clearInterval(photoCaptureInterval);
            setIsCapturing(false);
        };
    }, [videoRef.current, /*isCapturing,*/ selectedDevice]);

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
        setError(null);
    };

    // Add debug logging
    return (
        <div className="camera-container">
            <div className="camera-controls">
                <p className = "camera-controls-text">Select Camera Source</p>
                <select value = {selectedDevice} onChange = {handleDeviceChange} className = "device-select">
                    {devices.map(device => (
                        <option key = {device.deviceId} value = {device.deviceId}>
                            {device.label || `Camera ${devices.indexOf(device) + 1}`}
                        </option>
                    ))}
                </select>
            </div>
            <video ref = {videoRef} autoPlay playsInline muted className = "camera-feed"/>
            {error && (<div className="error-message">{error}</div>)}
        </div>
    );
}

export default App;
