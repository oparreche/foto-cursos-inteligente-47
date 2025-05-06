import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock class data - in a real application this would be fetched from a database or API
const classesData = [
  {
    id: 1,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Agosto",
    year: "2023",
    period: "Noturno",
    startDate: "07/08/2023",
    endDate: "01/09/2023",
    days: "Segundas e Quartas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 5,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Carlos Mendes",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia, desde a operação básica da câmera até técnicas de composição e iluminação.",
    benefits: [
      "Equipamentos disponíveis durante as aulas",
      "Certificado de conclusão",
      "Material didático digital",
      "Saída fotográfica em grupo",
      "Acesso à comunidade de alunos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 2,
    courseName: "Fotografia Básica",
    courseSlug: "fotografia-basica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Matutino",
    startDate: "11/09/2023",
    endDate: "06/10/2023",
    days: "Terças e Quintas",
    time: "09:00 - 12:00",
    location: "Centro, São Paulo",
    spotsAvailable: 10,
    totalSpots: 15,
    price: "R$ 1.200",
    instructor: "Ana Silva",
    description: "Um curso completo para iniciantes que desejam dominar os fundamentos da fotografia, desde a operação básica da câmera até técnicas de composição e iluminação.",
    benefits: [
      "Equipamentos disponíveis durante as aulas",
      "Certificado de conclusão",
      "Material didático digital",
      "Saída fotográfica em grupo",
      "Acesso à comunidade de alunos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 3,
    courseName: "Fotografia de Retrato",
    courseSlug: "fotografia-retrato",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Noturno",
    startDate: "04/09/2023",
    endDate: "13/10/2023",
    days: "Segundas e Quartas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 8,
    totalSpots: 12,
    price: "R$ 1.500",
    instructor: "Carlos Mendes",
    description: "Aprenda a capturar a essência e a personalidade de seus modelos através de técnicas de iluminação e direção de pose.",
    benefits: [
      "Estúdio profissional à disposição",
      "Modelos para prática em sala de aula",
      "Análise de portfólio individual",
      "Técnicas de edição de retrato",
      "Networking com outros fotógrafos"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 4,
    courseName: "Fotografia de Paisagem",
    courseSlug: "fotografia-paisagem",
    image: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?ixlib=rb-4.0.3",
    month: "Outubro",
    year: "2023",
    period: "Final de Semana",
    startDate: "07/10/2023",
    endDate: "28/10/2023",
    days: "Sábados",
    time: "09:00 - 16:00",
    location: "Centro, São Paulo",
    spotsAvailable: 15,
    totalSpots: 15,
    price: "R$ 1.400",
    instructor: "Ana Silva",
    description: "Explore a beleza natural e aprenda a fotografar paisagens deslumbrantes com técnicas de composição e exposição.",
    benefits: [
      "Saídas fotográficas em locações externas",
      "Equipamentos de apoio para fotografia de paisagem",
      "Técnicas de longa exposição",
      "Edição de paisagens no Lightroom",
      "Dicas para fotografar o nascer e o pôr do sol"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
  {
    id: 5,
    courseName: "Pós-produção e Edição",
    courseSlug: "pos-producao-edicao",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
    month: "Setembro",
    year: "2023",
    period: "Noturno",
    startDate: "12/09/2023",
    endDate: "19/10/2023",
    days: "Terças e Quintas",
    time: "19:00 - 22:00",
    location: "Centro, São Paulo",
    spotsAvailable: 0,
    totalSpots: 15,
    price: "R$ 1.600",
    instructor: "Ricardo Oliveira",
    description: "Aprimore suas habilidades de edição e tratamento de imagem com o Adobe Photoshop e Lightroom.",
    benefits: [
      "Licença de software educacional",
      "Plugins e presets exclusivos",
      "Técnicas de retoque de pele",
      "Correção de cor avançada",
      "Criação de efeitos especiais"
    ],
    paymentMethods: ["À vista com 10% de desconto", "Parcelamento em até 6x sem juros", "Boleto bancário"]
  },
];

const ClassDetail = () => {
  const { classSlug } = useParams();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating an API call with setTimeout
    setLoading(true);
    
    setTimeout(() => {
      // Parse the slug to extract course, month, year and period
      // Format is: courseSlug-month-year-period
      if (classSlug) {
        const slugParts = classSlug.split('-');
        if (slugParts.length >= 4) {
          const courseSlug = slugParts[0];
          const month = slugParts[1];
          const year = slugParts[2];
          const period = slugParts.slice(3).join('-');

          // Find the class that matches the slug components
          const foundClass = classesData.find(c => 
            c.courseSlug === courseSlug && 
            c.month.toLowerCase() === month.toLowerCase() && 
            c.year === year && 
            c.period.toLowerCase() === period.toLowerCase()
          );

          setClassData(foundClass || null);
        } else {
          setClassData(null);
        }
      }
      
      setLoading(false);
    }, 300);

    // Log for debugging
    console.log(`Loading class data for slug: ${classSlug}`);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [classSlug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!classData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="heading-lg mb-4">Turma não encontrada</h1>
          <p className="text-gray-600 mb-6">A turma que você está procurando não existe ou foi removida.</p>
          <Button asChild>
            <Link to="/turmas">Ver todas as turmas</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-photo-dark text-white">
        <div className="relative h-64 md:h-80 lg:h-96">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${classData.image})` }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="border-amber-400 text-amber-200">
                {classData.month}/{classData.year}
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-200">
                {classData.period}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {classData.courseName}
            </h1>
            <p className="text-gray-300 max-w-3xl">
              {classData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/turmas" className="text-purple inline-flex items-center hover:text-purple-dark transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para todas as turmas
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Class Details */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Detalhes da turma</h2>
              
              <div className="bg-white rounded-xl shadow-sm border mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Data de início</p>
                        <p className="font-medium">{classData.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Data de término</p>
                        <p className="font-medium">{classData.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium">{classData.days}, {classData.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Local</p>
                        <p className="font-medium">{classData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Vagas</p>
                        <p className="font-medium">
                          {classData.spotsAvailable} disponíveis de {classData.totalSpots}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Progress value={(classData.totalSpots - classData.spotsAvailable) / classData.totalSpots * 100} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Professor(a)</p>
                      <p className="font-medium">{classData.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Investimento</p>
                      <p className="text-xl font-bold text-purple">{classData.price}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">O curso inclui</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classData.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Methods */}
              <div>
                <h3 className="text-xl font-bold mb-4">Formas de pagamento</h3>
                <ul className="space-y-2">
                  {classData.paymentMethods.map((method: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple mt-0.5" />
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Enrollment Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold mb-4">Inscreva-se nesta turma</h3>
                  <p className="text-gray-600 mb-6">
                    Preencha o formulário abaixo para garantir sua vaga nesta turma.
                  </p>
                  
                  {classData.spotsAvailable > 0 ? (
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <Button className="w-full">Reservar minha vaga</Button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <Badge variant="destructive" className="mb-4">Turma lotada</Badge>
                      <p className="text-gray-600 mb-4">
                        Esta turma já está com todas as vagas preenchidas, mas você pode entrar em nossa lista de espera.
                      </p>
                      <Button variant="outline" className="w-full">Entrar na lista de espera</Button>
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
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Classes */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Outras turmas disponíveis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3"
                  alt="Fotografia Básica"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 left-0 bg-amber-600 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                  Outubro/2023
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Fotografia Básica</h3>
                <p className="text-sm text-gray-500 mb-3">Sábados, 09:00 - 16:00</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/turmas/fotografia-basica-outubro-2023-final de semana">Ver detalhes</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3"
                  alt="Fotografia de Retrato"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 left-0 bg-amber-600 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                  Setembro/2023
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Fotografia de Retrato</h3>
                <p className="text-sm text-gray-500 mb-3">Segundas e Quartas, 19:00 - 22:00</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/turmas/fotografia-retrato-setembro-2023-noturno">Ver detalhes</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3"
                  alt="Pós-produção e Edição"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 left-0 bg-amber-600 text-white px-3 py-1 rounded-br-lg font-medium text-sm">
                  Setembro/2023
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Pós-produção e Edição</h3>
                <p className="text-sm text-gray-500 mb-3">Terças e Quintas, 19:00 - 22:00</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/turmas/pos-producao-edicao-setembro-2023-noturno">Ver detalhes</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ClassDetail;
