
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import FinanceSidebar from '@/components/finance/FinanceSidebar';
import Dashboard from '@/components/finance/Dashboard';

// Este componente será o contêiner principal do sistema financeiro
const Finance: React.FC = () => {
  const { tab = 'dashboard' } = useParams<{ tab?: string }>();
  const validTabs = ['dashboard', 'receivables', 'payables', 'cashflow', 'refunds', 'categories'];
  
  // Verificar se a aba é válida
  if (!validTabs.includes(tab)) {
    return <Navigate to="/financeiro/dashboard" replace />;
  }
  
  return (
    <MainLayout>
      <div className="flex h-full">
        <FinanceSidebar currentTab={tab} />
        <div className="flex-1 p-8 overflow-auto">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'receivables' && <div>Contas a Receber (Em desenvolvimento)</div>}
          {tab === 'payables' && <div>Contas a Pagar (Em desenvolvimento)</div>}
          {tab === 'cashflow' && <div>Fluxo de Caixa (Em desenvolvimento)</div>}
          {tab === 'refunds' && <div>Estornos (Em desenvolvimento)</div>}
          {tab === 'categories' && <div>Categorias (Em desenvolvimento)</div>}
        </div>
      </div>
    </MainLayout>
  );
};

export default Finance;
