
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection"; // Direct import instead of lazy loading
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components that aren't immediately visible
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const CoursesSection = lazy(() => import("@/components/home/CoursesSection"));
const BlogPreviewSection = lazy(() => import("@/components/home/BlogPreviewSection"));

// Loading fallback for lazy loaded components
const LoadingFallback = () => (
  <div className="w-full py-16 flex flex-col items-center space-y-4">
    <Skeleton className="h-12 w-3/4 max-w-md" />
    <Skeleton className="h-4 w-2/3 max-w-sm" />
    <Skeleton className="h-32 w-full max-w-4xl" />
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BenefitsSection />
      {/* Render without Suspense since it's directly imported */}
      <GallerySection />
      <Suspense fallback={<LoadingFallback />}>
        <TestimonialsSection />
        <CoursesSection />
        <BlogPreviewSection />
      </Suspense>
      {/* Render ContactSection directly without Suspense since we're not lazy-loading it anymore */}
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
