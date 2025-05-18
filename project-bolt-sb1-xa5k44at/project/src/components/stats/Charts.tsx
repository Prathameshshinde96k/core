import React, { useEffect, useRef } from "react";

interface LineChartProps {
  data: {
    day: string;
    reviews: number;
  }[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.reviews));
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = "#94a3b8";
    ctx.stroke();
    
    // Draw points and lines
    const pointWidth = chartWidth / (data.length - 1);
    
    ctx.beginPath();
    ctx.moveTo(
      padding, 
      canvas.height - padding - (data[0].reviews / maxValue) * chartHeight
    );
    
    // Draw line
    data.forEach((point, i) => {
      const x = padding + i * pointWidth;
      const y = canvas.height - padding - (point.reviews / maxValue) * chartHeight;
      
      ctx.lineTo(x, y);
    });
    
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    data.forEach((point, i) => {
      const x = padding + i * pointWidth;
      const y = canvas.height - padding - (point.reviews / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw day labels
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.fillText(point.day, x, canvas.height - padding + 20);
      
      // Draw value labels
      if (i === 0 || i === data.length - 1 || point.reviews === maxValue) {
        ctx.fillStyle = "#64748b";
        ctx.textAlign = "center";
        ctx.fillText(point.reviews.toString(), x, y - 15);
      }
    });
  }, [data]);
  
  return (
    <div className="w-full h-64">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={250}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

interface PieChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Default data if total is 0
    let chartData = data;
    if (total === 0) {
      chartData = [
        { label: "No Data", value: 1, color: "#94a3b8" }
      ];
    }
    
    // Draw pie
    let startAngle = 0;
    
    chartData.forEach(item => {
      const sliceAngle = (item.value / (total || 1)) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw label line and text if slice is big enough
      if (sliceAngle > 0.2) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Calculate percentage
        const percentage = Math.round((item.value / (total || 1)) * 100);
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = canvas.width - 100;
    const legendY = 30;
    
    chartData.forEach((item, i) => {
      const y = legendY + i * 25;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(item.label, legendX + 25, y + 2);
    });
    
  }, [data]);
  
  return (
    <div className="w-full h-64">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={250}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};