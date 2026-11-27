import { FileText } from "lucide-react";

export default function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark-mark" aria-hidden="true">
        <FileText size={16} strokeWidth={2.2} />
      </span>
      AskMyPDF
    </span>
  );
}
