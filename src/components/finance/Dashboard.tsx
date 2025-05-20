
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PiggyBank, CreditCard, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialStats } from '@/hooks/useFinance';

const Dashboard: React.FC = () => {
  const { stats, isLoading } = useFinancialStats();
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando informações financeiras...</p>
      </div>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className={`h-4 w-4 ${stats.currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo baseado em transações confirmadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingReceivables)}</div>
            <p className="text-xs text-muted-foreground">
              De um total de {formatCurrency(stats.totalReceivables)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayables)}</div>
            <p className="text-xs text-muted-foreground">
              De um total de {formatCurrency(stats.totalPayables)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="mr-2 h-5 w-5 text-green-500" />
              Contas a Receber - Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Conteúdo a ser implementado */}
            <p className="text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-red-500" />
              Contas a Pagar - Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Conteúdo a ser implementado */}
            <p className="text-muted-foreground">Em implementação</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
