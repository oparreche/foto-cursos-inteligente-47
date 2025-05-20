
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
  Edit, 
  Trash2, 
  Check, 
  X, 
  FileText,
  Tag
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import EnrollmentForm from './EnrollmentForm';
import { useManualEnrollmentActions } from '@/hooks/useManualEnrollments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface EnrollmentsTableProps {
  enrollments: EnrollmentWithDetails[];
  isLoading: boolean;
}

const EnrollmentsTable: React.FC<EnrollmentsTableProps> = ({ enrollments, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateEnrollment, cancelEnrollment } = useManualEnrollmentActions();

  const handleEdit = (enrollment: EnrollmentWithDetails) => {
    setSelectedEnrollment(enrollment);
    setIsDialogOpen(true);
  };

  const handleCancel = (enrollment: EnrollmentWithDetails) => {
    setSelectedEnrollment(enrollment);
    setIsAlertOpen(true);
  };

  const confirmCancel = () => {
    if (selectedEnrollment) {
      cancelEnrollment.mutate(selectedEnrollment.id);
    }
    setIsAlertOpen(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check size={12} />
            Pago
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <FileText size={12} />
            Pendente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X size={12} />
            Vencido
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <X size={12} />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">{status}</Badge>
        );
    }
  };

  // Filtrar matrículas pelo termo de pesquisa
  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.coupon_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enrollment.notes && enrollment.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <TableHead>Curso/Turma</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Cupom</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Carregando matrículas...
                </TableCell>
              </TableRow>
            ) : filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhuma matrícula encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id} className={enrollment.payment_status === 'canceled' ? 'opacity-60' : ''}>
                  <TableCell className="font-medium">
                    {enrollment.student_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {enrollment.class_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatDate(enrollment.enrollment_date)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enrollment.payment_status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">R$ {enrollment.payment_amount.toFixed(2)}</span>
                      {enrollment.discount_amount > 0 && (
                        <span className="text-xs text-green-600">
                          Desconto: R$ {enrollment.discount_amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {enrollment.coupon_code ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag size={12} />
                        {enrollment.coupon_code}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(enrollment)}
                        disabled={enrollment.payment_status === 'canceled'}
                      >
                        <Edit size={16} />
                      </Button>
                      {enrollment.payment_status !== 'canceled' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancel(enrollment)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para edição de matrícula */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Matrícula</DialogTitle>
          </DialogHeader>
          {selectedEnrollment && (
            <EnrollmentForm
              initialData={selectedEnrollment}
              onSubmit={(values) => {
                updateEnrollment.mutate({ 
                  id: selectedEnrollment.id, 
                  values 
                });
                setIsDialogOpen(false);
              }}
              isSubmitting={updateEnrollment.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Alert dialog para confirmar cancelamento */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta matrícula? A vaga será devolvida para a turma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar Matrícula
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnrollmentsTable;
