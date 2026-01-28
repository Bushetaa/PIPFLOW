import { useFinanceReportContent, useFinanceNewsItems, useFinanceReportSeo } from "@/hooks/use-hasura-reports";
import { useRoute, Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function ReportContentPage() {
  const [match, params] = useRoute("/reports/:id");
  const id = params?.id;
  const { data: contents, isLoading } = useFinanceReportContent();
  const { data: news } = useFinanceNewsItems();
  const { data: seo } = useFinanceReportSeo();
  const { t, language } = useLanguage();

  const allContents = (contents || []).filter((c) => c.report_id === id);
  const content =
    allContents.find((c) => (c.language || "").toLowerCase() === language) ||
    allContents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  const relatedNews = (news || [])
    .filter((n) => n.report_id === id)
    .filter((item, idx, arr) => {
      const key = `${item.link || ""}|${item.title || ""}`;
      return arr.findIndex((i) => `${i.link || ""}|${i.title || ""}` === key) === idx;
    });
  const reportSeo = (seo || []).find((s) => s.report_id === id);

  if (!match) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_home")}
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
        </div>
      ) : !content ? (
        <div className="glass-card p-8 rounded-2xl">
          <p className="text-muted-foreground">No content found for this report.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-2xl space-y-6">
            {content.excerpt && (
              <p className="text-muted-foreground">{content.excerpt}</p>
            )}
            {content.article_html ? (
              <div
                className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content.article_html }}
              />
            ) : content.article_markdown ? (
              <pre className="whitespace-pre-wrap text-sm">{content.article_markdown}</pre>
            ) : (
              <p className="text-muted-foreground">No content available.</p>
            )}
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold">SEO</h3>
            {!reportSeo ? (
              <p className="text-muted-foreground text-sm">No SEO data.</p>
            ) : (
              <div className="space-y-3">
                {reportSeo.meta_title && (
                  <div className="text-sm">
                    <span className="font-medium">Title: </span>
                    <span className="text-muted-foreground">{reportSeo.meta_title}</span>
                  </div>
                )}
                {reportSeo.meta_description && (
                  <div className="text-sm">
                    <span className="font-medium">Description: </span>
                    <span className="text-muted-foreground">{reportSeo.meta_description}</span>
                  </div>
                )}
                {reportSeo.slug && (
                  <div className="text-sm">
                    <span className="font-medium">Slug: </span>
                    <span className="text-muted-foreground">{reportSeo.slug}</span>
                  </div>
                )}
                {reportSeo.focus_keyword && (
                  <div className="text-sm">
                    <span className="font-medium">Focus Keyword: </span>
                    <span className="text-muted-foreground">{reportSeo.focus_keyword}</span>
                  </div>
                )}
                {(reportSeo.tags || reportSeo.secondary_keywords) && (
                  <div className="text-sm space-y-2">
                    {reportSeo.tags && (
                      <div className="flex flex-wrap gap-2">
                        {String(reportSeo.tags).split(",").map((t) => (
                          <span key={t} className="px-2 py-1 rounded-full bg-muted text-xs">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    {reportSeo.secondary_keywords && (
                      <div className="flex flex-wrap gap-2">
                        {String(reportSeo.secondary_keywords).split(",").map((t) => (
                          <span key={t} className="px-2 py-1 rounded-full bg-muted text-xs">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold">Related News</h3>
            {relatedNews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No related news.</p>
            ) : (
              <div className="space-y-4">
                {relatedNews.map((item) => (
                  <div key={item.id} className="border border-border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <a
                        href={item.link || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium hover:text-primary"
                      >
                        {item.title || "Untitled"}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {item.published_at || item.published_at_raw || item.created_at}
                      </span>
                    </div>
                    {item.summary && (
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discussion and Decision Section */}
          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span>{t("discussion_decision")}</span>
            </h3>

            <div className="space-y-4">
              {/* Discussion */}
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-primary">{t("discussion")}</h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {content?.excerpt || t("no_discussion_available")}
                  </p>
                </div>
              </div>

              {/* Decision/Strategy */}
              <div className="space-y-2 pt-4 border-t border-border/50">
                <h4 className="text-lg font-medium text-primary">{t("decision")}</h4>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-foreground font-medium leading-relaxed">
                    {t("decision_placeholder")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
