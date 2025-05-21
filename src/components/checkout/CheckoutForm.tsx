import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePaymentProcessing } from '@/hooks/payments/usePaymentProcessing';
import type { CheckoutFormValues } from '@/types/checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';

// Form validation schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, { message: "Nome é obrigatório" }),
  lastName: z.string().min(2, { message: "Sobrenome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  address: z.string().min(3, { message: "Endereço é obrigatório" }),
  addressNumber: z.string().min(1, { message: "Número é obrigatório" }),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  postalCode: z.string().min(8, { message: "CEP inválido" }),
  paymentMethod: z.enum(['credit_card', 'pix', 'bank_slip']),
  cardNumber: z.string().optional(),
  cardHolderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  installments: z.number().optional(),
  classId: z.string(),
  couponCode: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "Você precisa concordar com os termos e condições"
  })
});

const CheckoutForm: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { processCheckout, isProcessing } = usePaymentProcessing();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
      classId: classId || '',
      agreeTerms: false
    }
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = (values: CheckoutFormValues) => {
    processCheckout(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                className={errors.cpf ? "border-red-500" : ""}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500 mt-1">{errors.birthDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="addressNumber">Número</Label>
              <Input
                id="addressNumber"
                {...register("addressNumber")}
                className={errors.addressNumber ? "border-red-500" : ""}
              />
              {errors.addressNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.addressNumber.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="addressComplement">Complemento</Label>
              <Input
                id="addressComplement"
                {...register("addressComplement")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                {...register("neighborhood")}
                className={errors.neighborhood ? "border-red-500" : ""}
              />
              {errors.neighborhood && (
                <p className="text-sm text-red-500 mt-1">{errors.neighborhood.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                {...register("state")}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="agreeTerms" 
          {...register("agreeTerms")}
        />
        <Label htmlFor="agreeTerms">
          Concordo com os termos e condições
        </Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
      )}

      <input type="hidden" {...register("classId")} value={classId} />

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processando..." : "Finalizar Compra"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
