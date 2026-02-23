import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, ExternalLink, Webhook, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/facebook-webhook`;

const Index = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    setCopied(true);
    toast({ title: "Copied!", description: "Webhook URL copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Webhook className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              Facebook Webhook
            </h1>
            <Badge className="bg-accent text-accent-foreground border-0 text-xs">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-foreground" />
              Live
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Your webhook endpoint is deployed and ready to receive events from Facebook.
          </p>
        </div>

        {/* Webhook URL */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4" />
              Callback URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2.5 text-xs text-foreground break-all font-mono">
                {WEBHOOK_URL}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyUrl}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Shield className="h-4 w-4" />
              Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4 text-sm text-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <p className="font-medium">Create a Facebook App</p>
                  <p className="text-muted-foreground">
                    Go to{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      developers.facebook.com
                      <ExternalLink className="h-3 w-3" />
                    </a>{" "}
                    and create or select an app.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <p className="font-medium">Add the Webhooks product</p>
                  <p className="text-muted-foreground">
                    In your app dashboard, click <strong>Add Product</strong> and select <strong>Webhooks</strong>.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <div>
                  <p className="font-medium">Configure the webhook</p>
                  <p className="text-muted-foreground">
                    Paste the <strong>Callback URL</strong> above and enter the same <strong>Verify Token</strong> you configured in your Cloud secrets.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </span>
                <div>
                  <p className="font-medium">Subscribe to events</p>
                  <p className="text-muted-foreground">
                    Select the fields you want to subscribe to (e.g., <code className="rounded bg-muted px-1 py-0.5 text-xs">messages</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">feed</code>,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">messaging_postbacks</code>).
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Supported Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supported Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["messages", "messaging_postbacks", "feed", "mention", "ratings", "leadgen"].map(
                (event) => (
                  <Badge key={event} variant="secondary" className="font-mono text-xs">
                    {event}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Events are logged server-side. Check your Cloud function logs to monitor incoming webhooks.
        </p>
      </div>
    </div>
  );
};

export default Index;
