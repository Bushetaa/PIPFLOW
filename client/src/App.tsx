import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useLanguageInit } from "@/hooks/use-language";
import { Background3D } from "@/components/Background3D";
import Dashboard from "@/pages/Dashboard";
import Market from "@/pages/Market";
import Reports from "@/pages/Reports";
import ReportContentPage from "@/pages/ReportContent";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/market" component={Market} />
      <Route path="/reports" component={Reports} />
      <Route path="/reports/:id" component={ReportContentPage} />
      {/* Settings page could be added later, reusing Dashboard as placeholder */}
      <Route path="/settings" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  useLanguageInit();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <div className="bg-grid-pattern" />
      <Background3D />
      <Header />
      <main className="relative z-10 flex-1 overflow-x-hidden p-6 md:p-12 lg:p-20">
        <div className="max-w-7xl mx-auto w-full">
          <Router />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
