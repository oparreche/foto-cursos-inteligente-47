import React, { useState } from 'react';
import { EnrollmentWithDetails } from '@/types/enrollment';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Printer,
  Check,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import EnrollmentForm from './EnrollmentForm';
import { useManualEnrollmentActions } from '@/hooks/useManualEnrollments';
import { Input } from '@/components/ui/input';

interface EnrollmentsTableProps {
  enrollments: EnrollmentWithDetails[];
  isLoading: boolean;
}

const EnrollmentsTable: React.FC<EnrollmentsTableProps> = ({ enrollments, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateEnrollment, cancelEnrollment } = useManualEnrollmentActions();

  const handleView = (enrollment: EnrollmentWithDetails) => {
    setSelectedEnrollment(enrollment);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar matrículas pelo termo de pesquisa
  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return (
          <Badge variant="outline" className="text-green-600 bg-green-100 flex items-center gap-1">
            <Check size={12} />
            Pago
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 bg-orange-100 flex items-center gap-1">
            <Clock size={12} />
            Pendente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="text-red-600 bg-red-100 flex items-center gap-1">
            <AlertTriangle size={12} />
            Vencido
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X size={12} />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar matrículas..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso / Turma</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando matrículas...
                </TableCell>
              </TableRow>
            ) : filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Nenhuma matrícula encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    {enrollment.student_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{enrollment.course_name}</span>
                      <span className="text-xs text-gray-500">{enrollment.class_name?.split(' - ')[1]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(enrollment.enrollment_date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatCurrency(enrollment.payment_amount)}</span>
                      {enrollment.discount_amount && enrollment.discount_amount > 0 && (
                        <span className="text-xs text-green-600">
                          Desconto: {formatCurrency(enrollment.discount_amount)}
                          {enrollment.coupon_code && ` (${enrollment.coupon_code})`}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enrollment.payment_status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(enrollment)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Printer size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para visualização detalhada da matrícula */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Matrícula</DialogTitle>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Aluno</h3>
                  <p>{selectedEnrollment.student_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Data da Matrícula</h3>
                  <p>{formatDate(selectedEnrollment.enrollment_date)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Curso / Turma</h3>
                <p>{selectedEnrollment.class_name}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Valor Original</h3>
                  <p>{formatCurrency(selectedEnrollment.original_amount)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Desconto</h3>
                  <p>{selectedEnrollment.discount_amount ? formatCurrency(selectedEnrollment.discount_amount) : '-'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Valor Final</h3>
                  <p className="font-medium">{formatCurrency(selectedEnrollment.payment_amount)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Status do Pagamento</h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedEnrollment.payment_status)}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Cupom Aplicado</h3>
                  <p>{selectedEnrollment.coupon_code || '-'}</p>
                </div>
              </div>
              
              {selectedEnrollment.notes && (
                <div>
                  <h3 className="font-medium text-sm">Observações</h3>
                  <p className="text-sm">{selectedEnrollment.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                {selectedEnrollment.payment_status !== 'canceled' && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
                        cancelEnrollment.mutate(selectedEnrollment.id);
                        setIsDialogOpen(false);
                      }
                    }}
                  >
                    Cancelar Matrícula
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnrollmentsTable;
