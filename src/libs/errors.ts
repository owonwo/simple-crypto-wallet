import { toast } from "sonner";
import { isEmpty } from "lodash";

function guessMessage(error: unknown): string {
  // @ts-expect-error Error can be any type
  const msg = error?.data?.message ?? error?.message;

  if (isEmpty(msg)) return "An unexpected error occurred";

  if (msg.includes("insufficient funds")) {
    return "You don't have sufficient funds";
  }

  return msg;
}

export function toastErrorMessage(err: unknown) {
  toast.error(guessMessage(err));
}
