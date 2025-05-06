
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentGatewaySettingsProps {
  onSave: () => void;
}

export const PaymentGatewaySettings = ({ onSave }: PaymentGatewaySettingsProps) => {
  return (
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
            <GatewaySection 
              title="Stripe" 
              fields={[
                { label: "API Key", type: "password", placeholder: "sk_•••••••••••••••••••••••••" },
                { label: "Webhook Secret", type: "password", placeholder: "whsec_•••••••••••••••••••••••••" }
              ]}
            />
            
            <GatewaySection 
              title="PayPal" 
              fields={[
                { label: "Client ID", type: "text", placeholder: "Insira o Client ID do PayPal" },
                { label: "Client Secret", type: "password", placeholder: "•••••••••••••••••••••••••" }
              ]}
            />
            
            <GatewaySection 
              title="Pagar.me"
              hasBorder={true}
              fields={[
                { label: "API Key", type: "password", placeholder: "ak_•••••••••••••••••••••••••" },
                { label: "Chave de Criptografia", type: "password", placeholder: "ek_•••••••••••••••••••••••••" }
              ]}
            />
            
            <AsaasSection />
          </div>
          
          <GeneralSettings />
          
          <div className="flex justify-end">
            <Button type="button" onClick={onSave}>Salvar Configurações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface GatewaySectionProps {
  title: string;
  fields: { label: string; type: string; placeholder: string }[];
  hasBorder?: boolean;
}

const GatewaySection = ({ title, fields, hasBorder = false }: GatewaySectionProps) => (
  <div className={`space-y-2 ${hasBorder ? 'pt-2 border-t' : ''}`}>
    <h3 className="text-lg font-medium">{title}</h3>
    <div className="grid gap-2">
      {fields.map((field, index) => (
        <div key={index} className="grid gap-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Input type={field.type} placeholder={field.placeholder} />
        </div>
      ))}
    </div>
  </div>
);

const AsaasSection = () => (
  <div className="space-y-2 pt-2 border-t">
    <h3 className="text-lg font-medium">Asaas</h3>
    <div className="grid gap-2">
      <div className="grid gap-2">
        <label className="text-sm font-medium">API Key</label>
        <Input type="password" placeholder="$aas_•••••••••••••••••••••••••" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Ambiente</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="asaas_environment" value="sandbox" defaultChecked />
            <span className="text-sm">Sandbox</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="asaas_environment" value="production" />
            <span className="text-sm">Produção</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const GeneralSettings = () => (
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
);
