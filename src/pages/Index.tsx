
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CoursesSection from "@/components/home/CoursesSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BenefitsSection />
      <GallerySection />
      <TestimonialsSection />
      <CoursesSection />
      <BlogPreviewSection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
