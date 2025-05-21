
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'credit_card' | 'pix' | 'bank_slip';
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  installments?: number;
  classId: string;
  couponCode?: string;
  agreeTerms: boolean;
};

export const usePaymentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processCheckout = async (values: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      console.log('Processing checkout with values:', values);
      
      // 1. Verify if the user exists or register a new one
      let userId: string | undefined;
      
      // Check if the user already exists by email
      const { data: existingUser, error: existingUserError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();
      
      if (existingUserError) {
        console.error('Error checking for existing user:', existingUserError);
      }
      
      if (existingUser) {
        userId = existingUser.id;
        console.log('Existing user found:', userId);
      } else {
        // Create new user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: Math.random().toString(36).slice(2, 10) + 'X1!', // Random secure password
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName
            }
          }
        });
        
        if (authError) throw new Error(`Authentication error: ${authError.message}`);
        
        userId = authData.user?.id;
        
        if (!userId) throw new Error('Failed to create user account');
        
        // Update complete profile information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: values.firstName,
            last_name: values.lastName,
            cpf: values.cpf,
            birth_date: values.birthDate,
            phone: values.phone,
            address: values.address,
            address_number: values.addressNumber,
            address_complement: values.addressComplement || null,
            neighborhood: values.neighborhood,
            city: values.city,
            state: values.state,
            postal_code: values.postalCode
          })
          .eq('id', userId);
          
        if (profileError) throw new Error(`Profile update error: ${profileError.message}`);
      }
      
      // 2. Process payment (in a real system, this would integrate with a payment gateway)
      // For now, we'll simulate the payment process
      
      // Check if a coupon was provided
      let discountAmount = 0;
      let couponId = null;
      
      if (values.couponCode) {
        const { data: coupon, error: couponError } = await supabase
          .from('discount_coupons')
          .select('*')
          .eq('code', values.couponCode)
          .maybeSingle();
          
        if (couponError) {
          console.error('Error fetching coupon:', couponError);
        } else if (coupon) {
          couponId = coupon.id;
          // Apply discount calculations based on the coupon
          // For now we'll just log it
          console.log('Coupon applied:', coupon.code);
        }
      }
      
      // Get class information
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('price')
        .eq('id', values.classId)
        .maybeSingle();
        
      if (classError) throw new Error(`Error fetching class data: ${classError.message}`);
      if (!classData) throw new Error(`Class not found with ID: ${values.classId}`);
      
      const amount = parseFloat(classData.price);
      
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: userId,
          status: 'completed', // In a real system, this would start as 'pending'
          amount: amount - discountAmount,
          payment_method: values.paymentMethod,
          installments: values.installments || 1,
          card_brand: values.paymentMethod === 'credit_card' ? 'mastercard' : null, // Simulated
          last_four: values.paymentMethod === 'credit_card' ? values.cardNumber?.slice(-4) : null,
          class_id: values.classId,
          coupon_id: couponId
        })
        .select()
        .single();
        
      if (transactionError) throw new Error(`Transaction error: ${transactionError.message}`);
      
      console.log('Transaction created:', transaction);
      
      // Create enrollment record after successful payment
      const { error: enrollmentError } = await supabase
        .from('manual_enrollments')
        .insert({
          student_id: userId,
          class_id: values.classId,
          payment_status: 'paid',
          coupon_id: couponId,
          payment_amount: amount - discountAmount,
          original_amount: amount,
          discount_amount: discountAmount,
          created_by: userId // In this case, the student is creating their own enrollment
        });
        
      if (enrollmentError) throw new Error(`Enrollment error: ${enrollmentError.message}`);
      
      toast.success('Matrícula realizada com sucesso!');
      
      // Redirect to success page
      navigate('/checkout/success');
      
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro no processo de pagamento: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processCheckout,
    isProcessing
  };
};
