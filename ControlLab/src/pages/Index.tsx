import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, Package, Wrench, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const sections = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Visão geral do sistema com KPIs e estatísticas",
      path: "/dashboard",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      icon: Building2,
      title: "Laboratórios",
      description: "Gerenciar laboratórios e seus equipamentos",
      path: "/laboratorios",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      icon: Package,
      title: "Inventário",
      description: "Gerenciar equipamentos e ativos",
      path: "/inventario",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
      },
    {
      icon: Wrench,
      title: "Manutenções",
      description: "Acompanhar manutenções preventivas e corretivas",
      path: "/manutencoes",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
    },
    ...(isAdmin ? [{
      icon: UserCheck,
      title: "Aprovações",
      description: "Gerenciar solicitações de técnicos",
      path: "/admin/aprovacoes",
      color: "bg-blue-50 text-blue-700",
     borderColor: "border-blue-200"
    }] : [])
  ];

return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        {/* Header */}
        <div className="px-4 py-8 text-center flex flex-col items-center">
          <div className="w-40 h-32 flex items-center justify-center mb-4">
            <img 
              src="/logo-final.png" 
              alt="Logo Labore Care" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Bem-vindo ao Labora-Care
          </h1>
          <p className="text-xl text-muted-foreground mb-2">SENAI Alagoinhas</p>
          <p className="text-base text-muted-foreground max-w-2xl">
            Sistema integrado de gestão de manutenção, inventário e laboratórios para a excelência operacional
          </p>
        </div>

      {/* Content */}
      <div className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Grid de opções */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.path} className={`border-2 ${section.borderColor} cursor-pointer hover:shadow-lg transition-all hover:scale-105`} onClick={() => navigate(section.path)}>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate(section.path)} className="w-full">
                      Acessar {section.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-[#002147] text-white p-8 rounded-[20px] shadow-lg flex flex-col md:flex-row items-center justify-between">
  <div className="flex flex-col">
    <h2 className="text-2xl font-bold mb-1">Unidade Alagoinhas</h2>
    <p className="text-sm opacity-80">
Suporte técnico: ramal 4002-8922    </p>
  </div>
  
  {/* Se quiser adicionar a linha vertical e a frase à direita como no outro banner */}
  <div className="hidden md:block w-[1px] h-12 bg-blue-400 mx-8 opacity-30"></div>
  
  <div className="hidden md:block italic text-xs text-right max-w-[1000px] opacity-80">
    "A tecnologia move o mundo, mas a gestão garante o futuro dos nossos laboratórios."
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
