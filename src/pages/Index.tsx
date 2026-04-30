import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Wrench, Component, UserCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const sections = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Indicadores em tempo real",
      path: "/dashboard",
      color: "bg-blue-600",
      lightColor: "bg-blue-50 text-blue-600",
    },
    {
      icon: Component,
      title: "Laboratórios",
      description: "Gestão de espaços físicos",
      path: "/laboratorios",
      color: "bg-indigo-600",
      lightColor: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Package,
      title: "Inventário",
      description: "Controle de ativos e insumos",
      path: "/inventario",
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Wrench,
      title: "Manutenções",
      description: "Preventivas e corretivas",
      path: "/manutencoes",
      color: "bg-amber-600",
      lightColor: "bg-amber-50 text-amber-600",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Estilo FIEMG/SENAI (Sólido e Forte) */}
      <div className="bg-[#003366] text-white pt-12 pb-24 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <img src="/logo-final.png" alt="SENAI" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Labora-Care <span className="text-blue-400">SENAI</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-light">
            Plataforma Integrada de Gestão Operacional e Excelência em Laboratórios
          </p>
        </div>
      </div>

      {/* Grid de Conteúdo - Subindo um pouco para "morder" o header */}
      <div className="px-4 -mt-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={section.path} 
                  className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group overflow-hidden"
                  onClick={() => navigate(section.path)}
                >
                  <div className={`h-2 ${section.color}`} /> {/* Barra de cor no topo do card */}
                  <CardHeader className="pt-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full ${section.lightColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-slate-800 text-xl font-bold">{section.title}</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <Button variant="ghost" className="text-blue-700 hover:text-blue-900 group">
                      Acessar <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Seção de Admin (se houver) */}
          {isAdmin && (
            <div className="mb-12">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4 ml-2">Administração</h3>
              <div 
                onClick={() => navigate("/admin/aprovacoes")}
                className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 text-white p-3 rounded-lg">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Aprovações de Cadastro</h4>
                    <p className="text-slate-500 text-sm">Gerencie novos acessos de técnicos e administradores</p>
                  </div>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          )}

          {/* Footer Card */}
          <div className="bg-[#002244] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">Unidade Alagoinhas</h2>
              <p className="text-blue-200">Suporte técnico: ramal 4002-8922</p>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-blue-500/30" />
            <p className="text-sm text-blue-100/70 max-w-md text-center md:text-right italic">
              "A tecnologia move o mundo, mas a gestão garante o futuro dos nossos laboratórios."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}