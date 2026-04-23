import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, UserCheck, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TechRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profile?: { full_name: string; phone: string | null };
  email?: string;
}

export default function AdminAprovacoes() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TechRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: reqs } = await supabase
      .from("technician_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (reqs) {
      const enriched = await Promise.all(
        reqs.map(async (req) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("user_id", req.user_id)
            .single();
          return { ...req, profile: profile ?? undefined };
        })
      );
      setRequests(enriched);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchRequests();
  }, [isAdmin]);

  const handleApprove = async (requestId: string) => {
    const { error } = await supabase.rpc("approve_technician", { request_id: requestId });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Aprovado!", description: "O técnico foi aprovado com sucesso." });
      fetchRequests();
    }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await supabase.rpc("reject_technician", { request_id: requestId });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rejeitado", description: "A solicitação foi rejeitada." });
      fetchRequests();
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Acesso restrito a administradores.</p>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pendente");
  const processed = requests.filter((r) => r.status !== "pendente");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Aprovações de Técnicos</h1>
          <p className="text-sm text-muted-foreground">Gerencie solicitações de cadastro como técnico</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-2xl font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{processed.length}</p>
              <p className="text-xs text-muted-foreground">Processadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Solicitações Pendentes</h2>
          {pending.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{req.profile?.full_name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">{req.profile?.phone || "Sem telefone"}</p>
                  <p className="text-xs text-muted-foreground">
                    Solicitado em {new Date(req.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(req.id)} className="gap-1">
                    <CheckCircle className="w-4 h-4" /> Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(req.id)} className="gap-1">
                    <XCircle className="w-4 h-4" /> Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pending.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma solicitação pendente.
          </CardContent>
        </Card>
      )}

      {/* Processed Requests */}
      {processed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Histórico</h2>
          {processed.map((req) => (
            <Card key={req.id} className="opacity-75">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{req.profile?.full_name || "Sem nome"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(req.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge variant={req.status === "aprovado" ? "default" : "destructive"}>
                  {req.status === "aprovado" ? "Aprovado" : "Rejeitado"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
