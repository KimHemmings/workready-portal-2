import { Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InviteResult, ResetPasswordResult } from "@/lib/types";

export function copyText(value: string, message: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.success(message))
    .catch(() => toast.error("Copy failed — please select and copy the text manually."));
}

/** Shows the magic invite link (and welcome message) so the inviter can hand it over directly. */
export function InviteLinkDialog({
  result,
  onClose,
}: {
  result: InviteResult | null;
  onClose: () => void;
}) {
  const fullLink = result ? `${window.location.origin}${result.invite_path}` : "";

  return (
    <Dialog open={Boolean(result)} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg" data-testid="invite-link-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {result ? `${result.user.name} is ready to join` : "Invite link"}
          </DialogTitle>
          <DialogDescription>
            No email is sent. Copy this personal magic link and give it to them — they set their own
            password when they open it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-1">
              Magic invite link
            </p>
            <p className="text-sm break-all" data-testid="invite-link-value">
              {fullLink}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => copyText(fullLink, "Invite link copied to your clipboard.")}
              data-testid="copy-magic-link-button"
            >
              <LinkIcon className="h-4 w-4 mr-1.5" aria-hidden="true" /> Copy link
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                result &&
                copyText(
                  result.welcome_message.replace(result.invite_path, fullLink),
                  "Welcome message copied — paste it into your SMS or email.",
                )
              }
              data-testid="copy-welcome-message-button"
            >
              <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" /> Copy welcome message
            </Button>
          </div>
          {result && (
            <pre
              className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border bg-card p-3 text-xs text-muted-foreground"
              data-testid="invite-welcome-message"
            >
              {result.welcome_message.replace(result.invite_path, fullLink)}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Shows a one-off temporary password after a password reset/override. */
export function TempPasswordDialog({
  result,
  onClose,
}: {
  result: ResetPasswordResult | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(result)} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="temp-password-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Temporary password for {result?.name ?? ""}
          </DialogTitle>
          <DialogDescription>
            Read this out or send it to {result?.email ?? "them"}. They'll be asked to choose a new
            password as soon as they sign in.
          </DialogDescription>
        </DialogHeader>
        <p
          className="rounded-lg border bg-muted/50 p-3 text-center text-lg font-mono tracking-wide"
          data-testid="temp-password-value"
        >
          {result?.temporary_password}
        </p>
        <Button
          onClick={() =>
            result && copyText(result.temporary_password, "Temporary password copied.")
          }
          data-testid="copy-temp-password-button"
        >
          <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" /> Copy password
        </Button>
      </DialogContent>
    </Dialog>
  );
}
