import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, MapPin, Clock, RefreshCw } from 'lucide-react';

const API_URL = 'https://datalogger-miguel.onrender.com/api/data'; // Asegúrate de que sea la IP de tu PC

function App() {
  const [datos, setDatos] = useState([]);
  const [ultimo, setUltimo] = useState(null);

  const fetchDatos = async () => {
    try {
      const res = await axios.get(API_URL);
      setDatos(res.data.reverse()); // Para la gráfica
      setUltimo(res.data[res.data.length - 1]); // El más reciente
    } catch (err) {
      console.error("Error buscando datos", err);
    }
  };

  useEffect(() => {
    fetchDatos();
    const interval = setInterval(fetchDatos, 5000); // Actualiza cada 5 seg
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <header className="mb-8 flex justify-between items-center border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-blue-400">📡 IoT Datalogger Global</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="animate-spin w-4 h-4" /> En vivo
        </div>
      </header>

      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2 text-orange-400">
            <Thermometer /> <span className="text-gray-400 uppercase text-xs font-bold">Temperatura</span>
          </div>
          <p className="text-3xl font-mono">{ultimo?.datos?.temp || '--'}°C</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2 text-blue-400">
            <Droplets /> <span className="text-gray-400 uppercase text-xs font-bold">Humedad</span>
          </div>
          <p className="text-3xl font-mono">{ultimo?.datos?.hum || '--'}%</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2 text-green-400">
            <MapPin /> <span className="text-gray-400 uppercase text-xs font-bold">GPS Status</span>
          </div>
          <p className="text-sm font-mono truncate">{ultimo?.datos?.lat ? `${ultimo.datos.lat}, ${ultimo.datos.lng}` : ultimo?.datos?.gps_status || 'Offline'}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-2 text-purple-400">
            <Clock /> <span className="text-gray-400 uppercase text-xs font-bold">Hora RTC</span>
          </div>
          <p className="text-sm font-mono">{ultimo?.datos?.hora_rtc || '--:--:--'}</p>
        </div>
      </div>

      {/* GRÁFICA EN TIEMPO REAL */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-80">
        <h2 className="text-lg font-bold mb-4">Historial de Temperatura</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp_server" hide />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Line type="monotone" dataKey="datos.temp" stroke="#f97316" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;