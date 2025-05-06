
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const enrollmentSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  spotsAvailable: number;
  totalSpots: number;
  classTitle: string;
  classPeriod: string;
}

const EnrollmentForm = ({ 
  spotsAvailable, 
  totalSpots, 
  classTitle,
  classPeriod
}: EnrollmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitlist, setIsWaitlist] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Enrollment data:", {
        ...data,
        classTitle,
        classPeriod,
        isWaitlist
      });
      
      toast({
        title: isWaitlist ? "Você está na lista de espera!" : "Inscrição realizada com sucesso!",
        description: isWaitlist 
          ? "Entraremos em contato caso surja uma vaga." 
          : "Em breve você receberá um e-mail com instruções para finalizar sua matrícula.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Erro ao processar inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlist = () => {
    setIsWaitlist(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden sticky top-24">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold mb-4">Inscreva-se nesta turma</h3>
        <p className="text-gray-600 mb-6">
          Preencha o formulário abaixo para garantir sua vaga nesta turma.
        </p>
        
        {spotsAvailable > 0 ? (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processando..." : "Reservar minha vaga"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <Badge variant="destructive" className="mb-4">Turma lotada</Badge>
            <p className="text-gray-600 mb-4">
              Esta turma já está com todas as vagas preenchidas, mas você pode entrar em nossa lista de espera.
            </p>
            {isWaitlist ? (
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <Button className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processando..." : "Entrar na lista de espera"}
                </Button>
              </form>
            ) : (
              <Button variant="outline" className="w-full" onClick={handleWaitlist}>
                Entrar na lista de espera
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-6">
        <p className="text-sm text-gray-600">
          Ao se inscrever, você concorda com nossos termos de serviço e política de privacidade.
          Para mais informações, entre em contato conosco pelo telefone ou WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default EnrollmentForm;
