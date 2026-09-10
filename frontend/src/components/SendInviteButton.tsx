import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Copy, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiPost, ApiError } from "@/lib/api";
import type { InviteEmailResult } from "@/lib/types";

function copy(value: string, message: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(message))
    .catch(() => toast.error("Copy failed — please select and copy manually."));
}

/**
 * "Send Invite" for a created user: fires the onboarding email through Resend and always shows the
 * rendered email, a copyable onboarding link and a mailto draft as a fallback.
 */
export default function SendInviteButton({
  inviterId,
  userId,
  userName,
  testId,
}: {
  inviterId: string;
  userId: string;
  userName: string;
  testId: string;
}) {
  const [result, setResult] = useState<InviteEmailResult | null>(null);

  const send = useMutation({
    mutationFn: () => apiPost<InviteEmailResult>(`/invite-email/${inviterId}/${userId}`),
    onSuccess: (res) => {
      setResult(res);
      if (res.status === "sent") toast.success(`Invitation emailed to ${res.recipient}.`);
      else if (res.status === "unavailable")
        toast.info("Email is not configured — use the mailto draft or copy the link.");
      else toast.error("Email could not be sent — use the mailto draft or copy the link.");
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not prepare that invitation.");
    },
  });

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => send.mutate()}
        disabled={send.isPending}
        data-testid={testId}
      >
        <Send className="h-4 w-4 mr-1.5" aria-hidden="true" />
        {send.isPending ? "Sending…" : "Send Invite"}
      </Button>

      <Dialog open={Boolean(result)} onOpenChange={(open: boolean) => !open && setResult(null)}>
        <DialogContent className="sm:max-w-lg" data-testid="send-invite-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              Invitation for {userName}
            </DialogTitle>
            <DialogDescription data-testid="send-invite-status">{result?.detail}</DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                  To
                </p>
                <p data-testid="send-invite-recipient">{result.recipient}</p>
                <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground mt-2">
                  Subject
                </p>
                <p data-testid="send-invite-subject">{result.subject}</p>
              </div>

              <pre
                className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border bg-card p-3 text-xs text-muted-foreground"
                data-testid="send-invite-body"
              >
                {result.body}
              </pre>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    window.location.href = result.mailto_url;
                  }}
                  data-testid="send-invite-mailto-button"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" aria-hidden="true" /> Open in mail app
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copy(result.invite_url, "Onboarding link copied.")}
                  data-testid="send-invite-copy-link-button"
                >
                  <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" /> Copy onboarding link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copy(result.body, "Email text copied.")}
                  data-testid="send-invite-copy-body-button"
                >
                  <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" /> Copy email text
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
