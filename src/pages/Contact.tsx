
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, this would send the data to a server
    console.log("Form data submitted:", formData);
    
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Entraremos em contato em breve.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark text-white">
        <div className="relative h-48 md:h-64">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3)` }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Entre em Contato
            </h1>
            <p className="text-gray-200">
              Estamos prontos para ajudar e responder suas dúvidas
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="Assunto da mensagem"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Digite sua mensagem aqui"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar mensagem
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-gray-600">contato@fotocursos.com</p>
                      <p className="text-gray-600">suporte@fotocursos.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple/10 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <p className="text-gray-600">(11) 3333-4444</p>
                      <p className="text-gray-600">(11) 99999-8888 (WhatsApp)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Endereço</h3>
                      <p className="text-gray-600">Av. Paulista, 1000, 3º andar</p>
                      <p className="text-gray-600">Bela Vista, São Paulo - SP</p>
                      <p className="text-gray-600">CEP: 01310-100</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                      <p className="text-gray-600">Segunda à Sexta: 9h às 18h</p>
                      <p className="text-gray-600">Sábados: 9h às 13h</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden h-64 border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.098677029185!2d-46.65679982496814!3d-23.565089178727387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1683007138210!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da localização da FotoCursos"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Como faço para me inscrever em um curso?</h3>
                <p className="text-gray-600">
                  Para se inscrever em um curso, basta navegar até a página de Turmas, selecionar o curso que deseja fazer e preencher o formulário de inscrição. Nossa equipe entrará em contato para confirmar sua matrícula.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Quais são as formas de pagamento aceitas?</h3>
                <p className="text-gray-600">
                  Aceitamos pagamento via cartão de crédito (parcelamento em até 10x), boleto bancário, transferência bancária e PIX. Para mais detalhes, entre em contato com nossa equipe financeira.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Posso cancelar minha inscrição? Como funciona o reembolso?</h3>
                <p className="text-gray-600">
                  Sim, você pode cancelar sua inscrição até 7 dias antes do início do curso com reembolso total. Para cancelamentos após esse período, consulte nossa política de reembolso através do nosso time de atendimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
