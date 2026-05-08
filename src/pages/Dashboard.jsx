import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getInstrumentos } from "../services/firestoreService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    prestados: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const instrumentos = await getInstrumentos();
        const total = instrumentos.length;
        const disponibles = instrumentos.filter(
          (i) => i.estado === "disponible"
        ).length;
        const prestados = total - disponibles;
        setStats({ total, disponibles, prestados });
      } catch (err) {
        console.error("Error al calcular las estadísticas:", err);
        setError("Error al calcular las estadísticas. Revisa las reglas de Firestore y la conexión.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total de Instrumentos" value={stats.total} />
          <StatCard title="Disponibles" value={stats.disponibles} />
          <StatCard title="En Préstamo" value={stats.prestados} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
