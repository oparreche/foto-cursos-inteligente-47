
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";

interface ClassDetailsProps {
  classData: {
    startDate: string;
    endDate: string;
    days: string;
    time: string;
    location: string;
    spotsAvailable: number;
    totalSpots: number;
    instructor: string;
    price: string;
    benefits: string[];
    paymentMethods: string[];
  };
}

const ClassDetails = ({ classData }: ClassDetailsProps) => {
  return (
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
  );
};

export default ClassDetails;
