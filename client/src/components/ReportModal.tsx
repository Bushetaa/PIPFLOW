import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnalysisReportSchema, type InsertAnalysisReport } from "@shared/routes";
import { useCreateReport } from "@/hooks/use-reports";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

export function ReportModal() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const createReport = useCreateReport();

  const form = useForm<InsertAnalysisReport>({
    resolver: zodResolver(insertAnalysisReportSchema),
    defaultValues: {
      pair: "",
      titleEn: "",
      titleAr: "",
      summaryEn: "",
      summaryAr: "",
      sentiment: "neutral",
      timeframe: "H1",
      confidence: 50,
    },
  });

  const onSubmit = (data: InsertAnalysisReport) => {
    createReport.mutate(data, {
      onSuccess: () => {
        toast({ title: t("success"), description: t("report_created") });
        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        toast({ title: t("error"), description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl">
          <Plus className="w-4 h-4" />
          {t("create_report")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("create_report")}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pair")}</FormLabel>
                    <FormControl>
                      <Input placeholder="EUR/USD" {...field} className="font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("timeframe")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_timeframe")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["M15", "H1", "H4", "D1", "W1"].map((tf) => (
                          <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sentiment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sentiment")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("select_sentiment")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bullish">{t("bullish")}</SelectItem>
                        <SelectItem value="bearish">{t("bearish")}</SelectItem>
                        <SelectItem value="neutral">{t("neutral")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confidence")} (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{t("english_content")}</h4>
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title_en")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summaryEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("summary_en")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border rounded-xl p-4 bg-muted/20" dir="rtl">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider text-left" dir="ltr">{t("arabic_content")}</h4>
              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">{t("title_ar")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summaryAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">{t("summary_ar")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-24 text-right" />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={createReport.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {createReport.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
