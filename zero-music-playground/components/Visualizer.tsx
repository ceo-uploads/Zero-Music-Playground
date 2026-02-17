
import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../services/audioEngine';
import { RowIndex } from '../types';

interface VisualizerProps {
  type: 'master' | 'sector';
  rowIndex?: RowIndex;
  color?: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ type, rowIndex, color = '#00f3ff' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const analyzer = type === 'master' ? audioEngine.mainAnalyzer : (rowIndex !== undefined ? audioEngine.getAnalyzer(rowIndex) : null);
      if (!analyzer) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'master' && audioEngine.analyzerL && audioEngine.analyzerR) {
        // STEREO VECTORSCOPE
        const vSize = 100;
        const centerX = canvas.width * 0.8;
        const centerY = canvas.height / 2;
        
        const timeL = new Float32Array(audioEngine.analyzerL.fftSize);
        const timeR = new Float32Array(audioEngine.analyzerR.fftSize);
        audioEngine.analyzerL.getFloatTimeDomainData(timeL);
        audioEngine.analyzerR.getFloatTimeDomainData(timeR);

        ctx.beginPath();
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';
        
        for (let i = 0; i < timeL.length; i += 4) {
          const l = timeL[i];
          const r = timeR[i];
          const x = (l - r) * vSize * 0.5;
          const y = (l + r) * vSize * 0.5;
          if (i === 0) ctx.moveTo(centerX + x, centerY - y);
          else ctx.lineTo(centerX + x, centerY - y);
        }
        ctx.stroke();

        // Spectrum on the left side of master
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzer.getByteFrequencyData(dataArray);
        const barWidth = (canvas.width * 0.6 / bufferLength) * 2;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
          ctx.fillStyle = color;
          ctx.shadowBlur = 5;
          ctx.shadowColor = color;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      } else {
        // SECTOR SPECTRUM
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzer.getByteFrequencyData(dataArray);
        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.6;
          ctx.fillStyle = color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = color;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [type, rowIndex, color]);

  return <canvas ref={canvasRef} width={800} height={200} className="w-full h-full object-cover" />;
};

export default Visualizer;
