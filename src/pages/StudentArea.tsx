
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import StudentHero from "@/components/student/StudentHero";
import LoginForm from "@/components/student/LoginForm";
import StudentDashboard from "@/components/student/StudentDashboard";

const StudentArea = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Student area auth check:", !!session);
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Erro ao verificar autenticação");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

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
      <StudentHero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {!isLoggedIn ? (
            <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
          ) : (
            <StudentDashboard onLogout={handleLogout} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default StudentArea;
