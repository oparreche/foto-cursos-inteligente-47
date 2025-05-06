
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

interface TransactionSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExport: () => void;
}

export const TransactionSearch = ({ searchTerm, setSearchTerm, onExport }: TransactionSearchProps) => {
  return (
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
      <Button onClick={onExport} className="gap-2">
        <Download className="h-4 w-4" /> Exportar Transações
      </Button>
    </div>
  );
};
