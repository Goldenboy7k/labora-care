import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003366] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#004080] to-[#002244] p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-2xl mb-4">
            <img src="/logo-final.png" alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-white text-2xl font-black tracking-widest uppercase">Labora-Care</h2>
          <div className="h-1 w-12 bg-blue-400 rounded-full mt-2"></div>
        </div>

        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-[#003366]">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-slate-500">Unidade SENAI Alagoinhas</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#003366] font-semibold">E-mail Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.nome@senai.br"
                  className="border-slate-300 focus:border-[#003366]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#003366] font-semibold">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-slate-300 focus:border-[#003366]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-[#003366] hover:bg-[#004488] text-white py-6 text-lg font-bold" 
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar no Sistema"}
              </Button>
              
              <p className="text-sm text-slate-600">
                Não possui permissão?{" "}
                <Link to="/cadastro" className="text-[#003366] font-bold hover:underline">
                  Solicitar Cadastro
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}