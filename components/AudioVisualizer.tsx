
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    mediaStream: MediaStream | null;
    isListening: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ mediaStream, isListening }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!mediaStream || !isListening) return;

        const initAudio = () => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(mediaStream);
            source.connect(analyser);
            sourceRef.current = source;

            draw();
        };

        const draw = () => {
            if (!canvasRef.current || !analyserRef.current) return;
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const renderFrame = () => {
                animationFrameRef.current = requestAnimationFrame(renderFrame);
                analyserRef.current!.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                // Center the visualization
                const centerY = canvas.height / 2;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 4; // Scale down
                    
                    // Create gradient
                    const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
                    gradient.addColorStop(0, '#818cf8'); // indigo-400
                    gradient.addColorStop(0.5, '#4f46e5'); // indigo-600
                    gradient.addColorStop(1, '#818cf8'); // indigo-400

                    ctx.fillStyle = gradient;
                    
                    // Draw rounded bars centered vertically
                    ctx.beginPath();
                    ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, 5);
                    ctx.fill();

                    x += barWidth + 2;
                }
            };

            renderFrame();
        };

        initAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [mediaStream, isListening]);

    if (!isListening) return <div className="h-12 w-full bg-gray-100/50 rounded-xl flex items-center justify-center text-xs text-gray-400">Microphone Inactive</div>;

    return (
        <canvas 
            ref={canvasRef} 
            width={300} 
            height={50} 
            className="w-full h-12 rounded-xl"
        />
    );
};

export default AudioVisualizer;
