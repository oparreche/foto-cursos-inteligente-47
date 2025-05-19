
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterSignup = () => {
  return (
    <div className="bg-amber-50 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Receba Novidades</h3>
      <p className="text-sm text-gray-600 mb-4">
        Inscreva-se para receber dicas, tutoriais e novidades do mundo da fotografia.
      </p>
      <div className="space-y-3">
        <Input placeholder="Seu melhor e-mail" />
        <Button className="w-full">Inscrever-se</Button>
      </div>
    </div>
  );
};

export default NewsletterSignup;
