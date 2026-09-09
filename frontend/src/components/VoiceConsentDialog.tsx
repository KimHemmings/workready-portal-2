import { Mic, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const KEY = "workready.voiceConsent";

export const hasVoiceConsent = () => localStorage.getItem(KEY) === "granted";
export const grantVoiceConsent = () => localStorage.setItem(KEY, "granted");

/** Consent gate shown once before the browser microphone is activated for AI feedback. */
export default function VoiceConsentDialog({
  open,
  onAllow,
  onCancel,
}: {
  open: boolean;
  onAllow: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-md" data-testid="voice-consent-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-brand-purple" aria-hidden="true" />
            Allow voice recording for AI feedback
          </DialogTitle>
          <DialogDescription>
            Your microphone is used to turn what you say into text in the answer box. You can edit the
            text before you send it, and typing instead always works.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            Speech is converted by your browser — no audio file is stored by us.
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            Only the text you send is used for AI interview feedback.
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            You can stop recording at any time with the same button.
          </li>
        </ul>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} data-testid="voice-consent-decline-button">
            Not now
          </Button>
          <Button
            className="bg-cta text-cta-foreground hover:bg-cta/90"
            onClick={onAllow}
            data-testid="voice-consent-allow-button"
          >
            Allow voice recording
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
