
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentTransaction } from "./types";
import { CreditCard, CheckCircle, XCircle, Clock, Search, Download } from "lucide-react";
import { toast } from "sonner";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"transactions" | "settings">("transactions");

  const handleSaveSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  const handleExportTransactions = () => {
    toast.success("Relatório de transações exportado com sucesso!");
  };

  // Filtrar transações baseado no termo de busca
  const filteredTransactions = transactions.filter(
    tx =>
      tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-8 w-[300px]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleExportTransactions} className="gap-2">
              <Download className="h-4 w-4" /> Exportar Transações
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactions.length}
                </div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transações Bem-sucedidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {transactions
                    .filter(t => t.status === "completed")
                    .reduce((total, tx) => total + tx.amount, 0)
                    .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>#{transaction.id}</TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{transaction.date.toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.status === "completed" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Completado</span>
                          </>
                        ) : transaction.status === "pending" ? (
                          <>
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-600">Pendente</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">Falhou</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Gateway de Pagamento</CardTitle>
              <CardDescription>
                Configure as integrações com os provedores de pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Stripe</h3>
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">API Key</label>
                        <Input type="password" placeholder="sk_•••••••••••••••••••••••••" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Webhook Secret</label>
                        <Input type="password" placeholder="whsec_•••••••••••••••••••••••••" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">PayPal</h3>
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Client ID</label>
                        <Input placeholder="Insira o Client ID do PayPal" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Client Secret</label>
                        <Input type="password" placeholder="•••••••••••••••••••••••••" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Configurações Gerais</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Moeda Padrão</label>
                        <Input defaultValue="BRL" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Notificação por Email</label>
                        <Input defaultValue="financeiro@escola.com" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={handleSaveSettings}>Salvar Configurações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGateway;
