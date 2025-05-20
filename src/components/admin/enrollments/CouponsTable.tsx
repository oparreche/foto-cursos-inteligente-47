
import React, { useState } from 'react';
import { DiscountCoupon } from '@/types/enrollment';
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
  Calendar, 
  PercentIcon,
  DollarSign 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import CouponForm from './CouponForm';
import { useDiscountCouponActions } from '@/hooks/useDiscountCoupons';
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

interface CouponsTableProps {
  coupons: DiscountCoupon[];
  isLoading: boolean;
}

const CouponsTable: React.FC<CouponsTableProps> = ({ coupons, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountCoupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateCoupon, deleteCoupon } = useDiscountCouponActions();

  const handleEdit = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleDelete = (coupon: DiscountCoupon) => {
    setSelectedCoupon(coupon);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      deleteCoupon.mutate(selectedCoupon.id);
    }
    setIsAlertOpen(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Filtrar cupons pelo termo de pesquisa
  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar cupons..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Carregando cupons...
                </TableCell>
              </TableRow>
            ) : filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Nenhum cupom encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{coupon.code}</span>
                      {coupon.description && (
                        <span className="text-xs text-gray-500">{coupon.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage' ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <PercentIcon size={12} />
                        Percentual
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign size={12} />
                        Valor Fixo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage' 
                      ? `${coupon.discount_value}%` 
                      : `R$ ${coupon.discount_value.toFixed(2)}`
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span className="text-xs">De: {formatDate(coupon.valid_from)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span className="text-xs">Até: {coupon.valid_until ? formatDate(coupon.valid_until) : 'Sem limite'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.is_active ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Check size={12} />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <X size={12} />
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.current_uses} {coupon.max_uses ? `/ ${coupon.max_uses}` : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(coupon)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para edição de cupom */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <CouponForm
              initialData={selectedCoupon}
              onSubmit={(values) => {
                updateCoupon.mutate({ 
                  id: selectedCoupon.id, 
                  values 
                });
                setIsDialogOpen(false);
              }}
              isSubmitting={updateCoupon.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Alert dialog para confirmar exclusão */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cupom <strong>{selectedCoupon?.code}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CouponsTable;
