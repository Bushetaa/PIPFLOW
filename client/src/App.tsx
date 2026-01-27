import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useLanguageInit } from "@/hooks/use-language";
import Dashboard from "@/pages/Dashboard";
import Market from "@/pages/Market";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/market" component={Market} />
      <Route path="/reports" component={Reports} />
      {/* Settings page could be added later, reusing Dashboard as placeholder */}
      <Route path="/settings" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  useLanguageInit();

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/20 bg-grid-pattern">
      <Sidebar />
      <main className="flex-1 lg:ltr:ml-72 lg:rtl:mr-72 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Router />
          </div>
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
