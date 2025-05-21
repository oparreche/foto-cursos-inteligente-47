
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EnrollmentForm from "@/components/class/EnrollmentForm";
import ClassDetails from "@/components/class/ClassDetails";
import RelatedClasses from "@/components/class/RelatedClasses";

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

// Sample related classes data
const relatedClassesData = [
  {
    slug: "fotografia-basica-outubro-2023-final-de-semana",
    title: "Fotografia Básica",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
    period: "Final de Semana",
    schedule: "Sábados, 09:00 - 16:00",
    date: "Outubro/2023"
  },
  {
    slug: "fotografia-retrato-setembro-2023-noturno",
    title: "Fotografia de Retrato",
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?ixlib=rb-4.0.3",
    period: "Noturno",
    schedule: "Segundas e Quartas, 19:00 - 22:00",
    date: "Setembro/2023"
  },
  {
    slug: "pos-producao-edicao-setembro-2023-noturno",
    title: "Pós-produção e Edição",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3",
    period: "Noturno",
    schedule: "Terças e Quintas, 19:00 - 22:00",
    date: "Setembro/2023"
  }
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
              <ClassDetails 
                id={classData.id.toString()}
                courseName={classData.courseName}
                courseSlug={classData.courseSlug}
                period={classData.period}
                days={classData.days}
                time={classData.time}
                location={classData.location}
                startDate={classData.startDate}
                endDate={classData.endDate}
                spotsAvailable={classData.spotsAvailable}
                price={classData.price.replace('R$ ', '')}
                description={classData.description}
                image={classData.image}
              />
            </div>
            
            {/* Enrollment Form */}
            <div className="lg:col-span-1">
              <EnrollmentForm 
                spotsAvailable={classData.spotsAvailable} 
                totalSpots={classData.totalSpots}
                classTitle={classData.courseName}
                classPeriod={`${classData.month}/${classData.year} - ${classData.period}`}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Classes */}
      <RelatedClasses relatedClasses={relatedClassesData} />
    </MainLayout>
  );
};

export default ClassDetail;
