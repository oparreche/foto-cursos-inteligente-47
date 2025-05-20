
interface AIConfigWarningProps {
  isConfigured: boolean;
}

const AIConfigWarning = ({ isConfigured }: AIConfigWarningProps) => {
  if (isConfigured) {
    return null;
  }
  
  return (
    <div className="text-red-500">
      <p>Atenção: As configurações de IA não foram definidas. Por favor, configure as credenciais de IA para usar este recurso.</p>
    </div>
  );
};

export default AIConfigWarning;
