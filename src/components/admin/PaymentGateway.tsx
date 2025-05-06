
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentTransaction } from "./types";
import { CheckCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

// Import refactored components
import { TransactionSearch } from "./payment/TransactionSearch";
import { TransactionStats } from "./payment/TransactionStats";
import { TransactionTable } from "./payment/TransactionTable";
import { PaymentGatewaySettings } from "./payment/PaymentGatewaySettings";

// Interface for storing invoice data
export interface StoredInvoice {
  id: string;
  transactionId: number;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  clientName: string;
  clientId: number;
  description: string;
  status: "processed" | "sent" | "downloaded" | "printed";
  createdAt: Date;
}

const PaymentGateway = () => {
  // Em um app real, isso viria de uma API e o estado seria gerenciado por um state manager como Redux, etc.
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: 1,
      userId: 101,
      userName: "Carlos Silva",
      amount: 990.00,
      status: "completed",
      date: new Date("2025-05-05"),
      method: "credit_card",
      description: "Matrícula - JavaScript Avançado"
    },
    {
      id: 2,
      userId: 102,
      userName: "Ana Oliveira",
      amount: 1200.00,
      status: "completed",
      date: new Date("2025-05-04"),
      method: "credit_card",
      description: "Matrícula - React Framework"
    },
    {
      id: 3,
      userId: 103,
      userName: "Roberto Almeida",
      amount: 890.00,
      status: "pending",
      date: new Date("2025-05-06"),
      method: "credit_card",
      description: "Matrícula - UX/UI Design"
    },
    {
      id: 4,
      userId: 104,
      userName: "Juliana Santos",
      amount: 990.00,
      status: "failed",
      date: new Date("2025-05-05"),
      method: "credit_card",
      description: "Matrícula - JavaScript Avançado"
    }
  ]);

  // Simulated server storage for invoices
  const [storedInvoices, setStoredInvoices] = useState<StoredInvoice[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"transactions" | "settings">("transactions");

  const handleSaveSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  const handleExportTransactions = () => {
    toast.success("Relatório de transações exportado com sucesso!");
  };

  // Server simulation: Store invoice data
  const storeInvoice = (invoice: Omit<StoredInvoice, 'id' | 'createdAt'>) => {
    return new Promise<StoredInvoice>((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Generate a unique ID for the invoice
          const newInvoice: StoredInvoice = {
            ...invoice,
            id: `inv_${Date.now()}`,
            createdAt: new Date()
          };
          
          // Update stored invoices
          setStoredInvoices(prev => [...prev, newInvoice]);
          
          // Simulate successful server response
          resolve(newInvoice);
          toast.success(`Nota fiscal ${invoice.invoiceNumber} armazenada no servidor com sucesso`);
        } catch (error) {
          // Simulate server error
          reject(new Error("Falha ao armazenar a nota fiscal no servidor"));
          toast.error("Erro ao armazenar a nota fiscal no servidor");
        }
      }, 800); // Simulate network delay
    });
  };

  // Server simulation: Get stored invoice
  const getInvoice = (invoiceId: string) => {
    return new Promise<StoredInvoice | undefined>((resolve, reject) => {
      setTimeout(() => {
        try {
          const invoice = storedInvoices.find(inv => inv.id === invoiceId);
          if (invoice) {
            resolve(invoice);
          } else {
            reject(new Error("Nota fiscal não encontrada"));
          }
        } catch (error) {
          reject(new Error("Erro ao buscar nota fiscal"));
        }
      }, 500);
    });
  };

  // Server simulation: Update invoice status
  const updateInvoiceStatus = (invoiceId: string, status: StoredInvoice['status']) => {
    return new Promise<StoredInvoice>((resolve, reject) => {
      setTimeout(() => {
        try {
          setStoredInvoices(prev => {
            const updated = prev.map(inv => {
              if (inv.id === invoiceId) {
                return { ...inv, status };
              }
              return inv;
            });
            
            const updatedInvoice = updated.find(inv => inv.id === invoiceId);
            if (updatedInvoice) {
              resolve(updatedInvoice);
            } else {
              reject(new Error("Nota fiscal não encontrada"));
            }
            
            return updated;
          });
        } catch (error) {
          reject(new Error("Erro ao atualizar status da nota fiscal"));
          toast.error("Erro ao atualizar status da nota fiscal");
        }
      }, 500);
    });
  };

  // Filter transactions based on both search term and date range
  const filteredTransactions = transactions.filter((tx) => {
    // Search term filter
    const matchesSearch = 
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let withinDateRange = true;
    if (dateRange?.from) {
      withinDateRange = tx.date >= dateRange.from;
      
      if (dateRange.to) {
        // Add one day to make the range inclusive
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        withinDateRange = withinDateRange && tx.date < endDate;
      }
    }
    
    return matchesSearch && withinDateRange;
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "transactions" | "settings")}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Transações
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <TransactionSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExport={handleExportTransactions}
          />
          <TransactionStats transactions={filteredTransactions} />
          <TransactionTable 
            transactions={filteredTransactions}
            searchTerm={searchTerm}
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
