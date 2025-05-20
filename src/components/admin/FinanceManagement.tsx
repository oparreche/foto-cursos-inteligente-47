
import React, { useState } from "react";
import PaymentGateway from "./payment/PaymentGateway";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  RefreshCcw, 
  Tag, 
  Settings 
} from 'lucide-react';

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Total de Receitas</h3>
              <p className="text-2xl font-bold">R$ 15.750,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Total de Despesas</h3>
              <p className="text-2xl font-bold">R$ 8.325,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Saldo</h3>
              <p className="text-2xl font-bold">R$ 7.425,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="receivables" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" /> Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="payables" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Estornos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Gateway de Pagamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dashboard Financeiro</h3>
            <p>Visão geral das finanças da empresa.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="receivables">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Receber</h3>
            <p>Gerencie os pagamentos pendentes e recebidos.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="payables">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Pagar</h3>
            <p>Controle suas despesas e pagamentos pendentes.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa</h3>
            <p>Acompanhe suas entradas e saídas financeiras.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estornos</h3>
            <p>Gerencie os estornos de pagamentos.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <p>Organize suas finanças com categorias personalizadas.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentGateway />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
