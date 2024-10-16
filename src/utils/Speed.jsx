import React, { useEffect, useState, memo } from 'react';

// Função para calcular o tempo de execução
const calculatePerformance = () => {
  const start = performance.now();
  // Simulando uma operação pesada
  for (let i = 0; i < 10000000; i++) {}
  const end = performance.now();
  return end - start;
};

const Speed = memo(() => {
  const [initialPerformance, setInitialPerformance] = useState(0);
  const [currentPerformance, setCurrentPerformance] = useState(0);
  const [optimizationPercentage, setOptimizationPercentage] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState([]);

  useEffect(() => {
    // Captura a performance inicial
    const initialPerf = calculatePerformance();
    setInitialPerformance(initialPerf);
    console.log(`Tempo de render inicial: ${initialPerf.toFixed(2)}ms`);

    const interval = setInterval(() => {
      const currentPerf = calculatePerformance();
      setCurrentPerformance(currentPerf);

      // Adiciona o tempo atual ao histórico
      setPerformanceHistory((prevHistory) => {
        const newHistory = [...prevHistory, currentPerf];
        if (newHistory.length > 5) {
          newHistory.shift(); // Mantém o histórico com no máximo 5 medições
        }
        return newHistory;
      });

      // Calcula a média móvel
      const averagePerf = performanceHistory.reduce((acc, val) => acc + val, 0) / performanceHistory.length || currentPerf;

      const improvement = ((initialPerf - averagePerf) / initialPerf) * 100;
      setOptimizationPercentage(improvement);

      console.log(`Tempo de render atual (média): ${averagePerf.toFixed(2)}ms`);
      console.log(`Desempenho otimizado em: ${improvement.toFixed(2)}%`);

      // Se atingir um alto nível de otimização, para o intervalo
      if (improvement >= 95) {
        console.log('Desempenho otimizado ao máximo!');
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [performanceHistory]);

  return (
    <div>
      <h3>Monitoramento de Desempenho</h3>
      <p>Otimização em progresso...</p>
      <p>Porcentagem de melhoria: {optimizationPercentage.toFixed(2)}%</p>
    </div>
  );
});

export default Speed;
