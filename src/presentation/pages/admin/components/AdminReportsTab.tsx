import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { supabase } from '@infrastructure/supabase/client';

const COLORS = ['#35d2db', '#33bb9d', '#f1b307', '#ec4899', '#8b5cf6'];

const AdminReportsTab: React.FC = () => {
  const [userStats, setUserStats] = useState<{ name: string; value: number }[]>([]);
  const [propertyGrowth, setPropertyGrowth] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // 1. Usuarios por Plan
        const { data: users, error: userError } = await supabase
          .from('usuarios')
          .select('plan');
        
        if (!userError && users) {
          const stats = users.reduce((acc: any, curr) => {
            const plan = curr.plan || 'gratuito';
            acc[plan] = (acc[plan] || 0) + 1;
            return acc;
          }, {});
          
          setUserStats(Object.keys(stats).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: stats[key]
          })));
        }

        // 2. Crecimiento de Propiedades y Estados Reales
        const { data: props, error: propError } = await supabase
          .from('propiedades')
          .select('fechacreacion, estadoPublicacion');

        if (!propError && props) {
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          const countsByMonth: Record<string, number> = {};
          
          props.forEach(p => {
            const date = new Date(p.fechacreacion);
            const m = months[date.getMonth()];
            countsByMonth[m] = (countsByMonth[m] || 0) + 1;
          });

          setPropertyGrowth(months.map(m => ({
            month: m,
            count: countsByMonth[m] || 0
          })).filter((_, i) => i <= new Date().getMonth()));
        }

      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="admin-empty-state">Cargando estadísticas...</div>;

  return (
    <div className="admin-reports">
      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Gráfico de Usuarios */}
        <div className="report-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1a202c' }}>Distribución de Usuarios</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crecimiento de Propiedades */}
        <div className="report-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#1a202c' }}>Nuevas Publicaciones (Mensual)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={propertyGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#35d2db" radius={[4, 4, 0, 0]} name="Propiedades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen Financiero Estimado */}
        <div className="report-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '20px', color: '#1a202c' }}>Rendimiento de la Plataforma</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={propertyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#33bb9d" strokeWidth={3} name="Interacciones Estimadas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReportsTab;
