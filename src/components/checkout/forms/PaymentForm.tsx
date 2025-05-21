
import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckoutFormValues } from '@/types/checkout';

interface PaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ register, watch, errors }) => {
  const paymentMethod = watch('paymentMethod');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Método de Pagamento</Label>
          <RadioGroup 
            defaultValue="credit_card" 
            className="grid grid-cols-3 gap-4 mt-2"
            {...register("paymentMethod")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Cartão de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix">PIX</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_slip" id="bank_slip" />
              <Label htmlFor="bank_slip">Boleto</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'credit_card' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                {...register("cardNumber")}
              />
            </div>
            <div>
              <Label htmlFor="cardHolderName">Nome no Cartão</Label>
              <Input
                id="cardHolderName"
                placeholder="Nome como está no cartão"
                {...register("cardHolderName")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Data de Validade</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  {...register("expiryDate")}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  {...register("cvv")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="installments">Parcelas</Label>
              <select
                id="installments"
                className="w-full p-2 border rounded"
                {...register("installments", { valueAsNumber: true })}
              >
                <option value={1}>1x sem juros</option>
                <option value={2}>2x sem juros</option>
                <option value={3}>3x sem juros</option>
                <option value={4}>4x sem juros</option>
                <option value={5}>5x sem juros</option>
                <option value={6}>6x sem juros</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="couponCode">Cupom de Desconto</Label>
          <Input
            id="couponCode"
            placeholder="Se você tem um cupom, digite aqui"
            {...register("couponCode")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
