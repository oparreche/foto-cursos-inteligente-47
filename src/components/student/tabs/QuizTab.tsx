
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from 'lucide-react';
import { QuizDifficulty, QuizCategory } from '@/types/quiz';
import { useQuizCategories } from '@/hooks/useQuiz';

const QuizTab = () => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('all');
  const [category, setCategory] = useState<QuizCategory>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  const { data: categories = [], isLoading: isLoadingCategories } = useQuizCategories();
  const navigate = useNavigate();

  return (
    <>
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <BarChart className="mr-2 h-5 w-5" />
        Quiz de Fotografia
      </h3>
      
      <Card className="p-6 mb-6">
        <h4 className="font-bold text-lg mb-4">Configurações do Quiz</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuizDifficulty)}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Selecione a dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questionCount">Número de Questões</Label>
            <Select 
              value={questionCount.toString()} 
              onValueChange={(value) => setQuestionCount(parseInt(value, 10))}
            >
              <SelectTrigger id="questionCount">
                <SelectValue placeholder="Número de questões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 questões</SelectItem>
                <SelectItem value="10">10 questões</SelectItem>
                <SelectItem value="15">15 questões</SelectItem>
                <SelectItem value="20">20 questões</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => navigate('/quiz')} 
            className="w-full mt-2"
          >
            Iniciar Quiz
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-bold mb-2">Seu Histórico de Quiz</h4>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span>Quiz de Fotografia Básica</span>
              <span className="font-medium">8/10 pontos</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Quiz de Composição</span>
              <span className="font-medium">7/10 pontos</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Quiz de Iluminação</span>
              <span className="font-medium">9/10 pontos</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-bold mb-2">Suas Conquistas</h4>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <BarChart className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-sm font-medium">Conhecedor de Fotografia</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <BarChart className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-sm font-medium">Mestre das Cores</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default QuizTab;
