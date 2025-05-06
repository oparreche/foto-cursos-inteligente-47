
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

// Import refactored components
import { useTransactions } from "./payment/hooks/useTransactions";
import { TransactionsTab } from "./payment/TransactionsTab";
import { PaymentGatewaySettings } from "./payment/PaymentGatewaySettings";
import { PaymentGatewayProps } from "./payment/types";

const PaymentGateway = ({ activeTab: initialTab, onTabChange }: PaymentGatewayProps = {}) => {
  const [activeTab, setActiveTab] = useState<"transactions" | "settings">(initialTab || "transactions");

  const {
    filteredTransactions,
    storedInvoices,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    storeInvoice,
    updateInvoiceStatus,
    handleExportTransactions
  } = useTransactions();

  const handleTabChange = (value: string) => {
    const tab = value as "transactions" | "settings";
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSaveSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Transações
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <TransactionsTab
            filteredTransactions={filteredTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            handleExportTransactions={handleExportTransactions}
            storedInvoices={storedInvoices}
            storeInvoice={storeInvoice}
            updateInvoiceStatus={updateInvoiceStatus}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <PaymentGatewaySettings onSave={handleSaveSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGateway;
