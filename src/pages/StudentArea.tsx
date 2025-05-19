import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const StudentArea = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: "midiaputz@gmail.com",
    password: "*Putz123"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      setIsLoggedIn(true);
    } catch (error: any) {
      toast.error(`Erro ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao fazer logout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRedirect = () => {
    navigate('/admin');
  };

  const handleLoginPageRedirect = () => {
    navigate('/login?register=true');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark text-white">
        <div className="relative h-48 md:h-64">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516321165247-4aa89a48be28?ixlib=rb-4.0.3)` }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Área do Aluno
            </h1>
            <p className="text-gray-200">
              Acesse materiais exclusivos, certificados e acompanhe seu progresso
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {!isLoggedIn ? (
            <div className="max-w-md mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLoginSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={loginForm.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        value={loginForm.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <a href="#" className="text-sm text-purple hover:underline">
                        Esqueci minha senha
                      </a>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Processando..." : "Entrar"}
                    </Button>
                    
                    <div className="flex justify-between pt-4">
                      <Button onClick={handleLoginPageRedirect} variant="outline" size="sm">
                        Página de Admin
                      </Button>
                      <Button onClick={handleAdminRedirect} variant="outline" size="sm">
                        Ir para Admin
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Ainda não tem uma conta? <a href="#" className="text-purple hover:underline">Entre em contato</a>
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Olá, Estudante!</h2>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleAdminRedirect}>Área Admin</Button>
                  <Button variant="outline" onClick={handleLogout}>Sair</Button>
                </div>
              </div>

              <Tabs defaultValue="courses">
                <TabsList className="mb-6">
                  <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
                  <TabsTrigger value="materials">Materiais</TabsTrigger>
                  <TabsTrigger value="certificates">Certificados</TabsTrigger>
                  <TabsTrigger value="account">Minha Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="courses">
                  <h3 className="text-xl font-bold mb-4">Meus Cursos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="font-bold mb-2">Fotografia Básica</h4>
                      <p className="text-sm text-gray-600 mb-2">Turma: Agosto 2023 - Noturno</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-purple rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Ver detalhes</Button>
                    </Card>
                    
                    <Card className="p-6">
                      <h4 className="font-bold mb-2">Fotografia de Retrato</h4>
                      <p className="text-sm text-gray-600 mb-2">Turma: Setembro 2023 - Noturno</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>30%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-purple rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Ver detalhes</Button>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="materials">
                  <h3 className="text-xl font-bold mb-4">Materiais de Estudo</h3>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Apostila - Fundamentos da Fotografia</h4>
                          <p className="text-sm text-gray-600">PDF - 15MB</p>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Slides - Composição Fotográfica</h4>
                          <p className="text-sm text-gray-600">PDF - 8MB</p>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">E-book - Guia de Iluminação</h4>
                          <p className="text-sm text-gray-600">PDF - 12MB</p>
                        </div>
                        <Button size="sm">Download</Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="certificates">
                  <h3 className="text-xl font-bold mb-4">Meus Certificados</h3>
                  <p className="text-gray-600 mb-6">
                    Os certificados ficam disponíveis após a conclusão dos cursos.
                  </p>
                  
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Fotografia Básica</h4>
                          <p className="text-sm text-gray-600">Concluído em 01/09/2023</p>
                        </div>
                        <Button size="sm">Ver certificado</Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="account">
                  <h3 className="text-xl font-bold mb-4">Minha Conta</h3>
                  <Card className="p-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input id="name" defaultValue="José Silva" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue="jose@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input id="phone" defaultValue="(11) 99999-9999" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthdate">Data de nascimento</Label>
                          <Input id="birthdate" defaultValue="15/05/1990" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" defaultValue="Av. Paulista, 1000, São Paulo - SP" />
                      </div>
                      
                      <Button type="submit">Salvar alterações</Button>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default StudentArea;
