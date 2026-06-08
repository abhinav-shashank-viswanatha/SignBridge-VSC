import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/signbridge/Layout";
<<<<<<< HEAD
import Home from "@/pages/Home"; // ✅ correct import
=======
import Home from "@/pages/Home";
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
import Features from "@/pages/Features";
import Demo from "@/pages/Demo";
import Technology from "@/pages/Technology";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
<<<<<<< HEAD
            <Route path="/" element={<Home />} /> {/* ✅ fixed */}
=======
            <Route path="/" element={<Home />} /> 
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
            <Route path="/features" element={<Features />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;