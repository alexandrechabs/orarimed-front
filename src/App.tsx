import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SpecialitiesListPage from "./pages/SpecialitiesListPage";
import SpecialtyPage from "./pages/SpecialtyPage";
import AktualitetePage from "./pages/AktualitetePage";
import KontaktPage from "./pages/KontaktPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/specialitete" element={<SpecialitiesListPage />} />
          <Route path="/specialitete/:slug" element={<SpecialtyPage />} />
          <Route path="/aktualitete" element={<AktualitetePage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
