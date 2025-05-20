
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  PhotographyQuestion, 
  PhotographyAnswer, 
  QuestionWithAnswers,
  QuizDifficulty,
  QuizCategory,
  QuizScore
} from '@/types/quiz';

// Hook para buscar questões de fotografia com suas respostas
export const useQuizQuestions = (
  difficulty: QuizDifficulty = 'all',
  category: QuizCategory = 'all',
  limit: number = 10
) => {
  const fetchQuestions = async (): Promise<QuestionWithAnswers[]> => {
    // Primeiro buscar as questões de acordo com os filtros
    let query = supabase
      .from('photography_questions')
      .select('*');
    
    // Aplicar filtros, se não for 'all'
    if (difficulty !== 'all') {
      query = query.eq('difficulty', difficulty);
    }
    
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Executar a consulta e capturar os resultados
    const { data: questions, error: questionsError } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (questionsError) {
      console.error('Erro ao buscar questões:', questionsError);
      toast.error('Erro ao carregar perguntas do quiz');
      throw questionsError;
    }
    
    if (!questions || questions.length === 0) {
      return [];
    }
    
    // Para cada questão, buscar suas respostas
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const { data: answers, error: answersError } = await supabase
          .from('photography_answers')
          .select('*')
          .eq('question_id', question.id);
        
        if (answersError) {
          console.error('Erro ao buscar respostas:', answersError);
          toast.error('Erro ao carregar alternativas das perguntas');
          throw answersError;
        }
        
        return {
          ...question,
          answers: answers || []
        };
      })
    );
    
    return questionsWithAnswers;
  };
  
  return useQuery({
    queryKey: ['quizQuestions', difficulty, category, limit],
    queryFn: fetchQuestions,
  });
};

// Hook para buscar todas as categorias de questões
export const useQuizCategories = () => {
  const fetchCategories = async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('photography_questions')
      .select('category');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias do quiz');
      throw error;
    }
    
    // Extrair e remover duplicatas
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  };
  
  return useQuery({
    queryKey: ['quizCategories'],
    queryFn: fetchCategories,
  });
};

// Hook para gerenciar o estado do quiz
export const useQuizState = (questions: QuestionWithAnswers[] = []) => {
  const [state, setState] = useState({
    currentQuestionIndex: 0,
    questions: [] as QuestionWithAnswers[],
    selectedAnswers: {} as Record<string, string>,
    score: 0,
    isFinished: false,
    loading: true
  });
  
  // Atualizar o estado quando as questões são carregadas
  useEffect(() => {
    if (questions.length > 0) {
      setState(prev => ({
        ...prev,
        questions,
        loading: false
      }));
    }
  }, [questions]);
  
  // Selecionar resposta para a questão atual
  const selectAnswer = (questionId: string, answerId: string) => {
    setState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [questionId]: answerId
      }
    }));
  };
  
  // Avançar para a próxima questão
  const nextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };
  
  // Voltar para a questão anterior
  const previousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };
  
  // Finalizar o quiz e calcular pontuação
  const finishQuiz = () => {
    let score = 0;
    
    // Calcular pontuação
    state.questions.forEach(question => {
      const selectedAnswerId = state.selectedAnswers[question.id];
      if (selectedAnswerId) {
        const correctAnswer = question.answers.find(answer => answer.is_correct);
        if (correctAnswer && correctAnswer.id === selectedAnswerId) {
          score++;
        }
      }
    });
    
    // Atualizar estado com pontuação final
    setState(prev => ({
      ...prev,
      score,
      isFinished: true
    }));
    
    // Retornar resultado para uso em outras funções
    return {
      score,
      totalQuestions: state.questions.length,
      percentage: (score / state.questions.length) * 100,
      date: new Date()
    };
  };
  
  // Reiniciar o quiz
  const restartQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      questions: state.questions,
      selectedAnswers: {},
      score: 0,
      isFinished: false,
      loading: false
    });
  };
  
  return {
    state,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz
  };
};

// Hook para salvar pontuação do quiz
export const useSaveQuizScore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ score, totalQuestions }: { score: number, totalQuestions: number }) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast.error('Você precisa estar logado para salvar sua pontuação');
        throw new Error('Usuário não autenticado');
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('quiz_scores')
        .insert([{
          user_id: userId,
          score,
          total_questions: totalQuestions,
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizScores'] });
      toast.success('Pontuação salva com sucesso!');
    },
    onError: (error) => {
      if (error.message !== 'Usuário não autenticado') {
        toast.error(`Erro ao salvar pontuação: ${error.message}`);
      }
    }
  });
};

// Hook para buscar histórico de pontuações do usuário
export const useQuizScores = () => {
  const fetchScores = async (): Promise<QuizScore[]> => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session?.user) {
      return [];
    }
    
    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('date_played', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar pontuações:', error);
      toast.error('Erro ao carregar histórico de pontuações');
      throw error;
    }
    
    return data || [];
  };
  
  return useQuery({
    queryKey: ['quizScores'],
    queryFn: fetchScores,
  });
};
