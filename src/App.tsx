
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import StudentArea from "./pages/StudentArea";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/:slug" element={<CourseDetail />} />
          <Route path="/turmas" element={<Classes />} />
          <Route path="/turmas/:classSlug" element={<ClassDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/area-do-aluno" element={<StudentArea />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
