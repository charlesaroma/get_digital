/* A ticket's QR code. It holds only the ticket code; the door scanner looks the code up on the server. */
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

export default function TicketQr({ code, className }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toString(code, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#171828", light: "#ffffff" } }).then((s) => live && setSvg(s));
    return () => {
      live = false;
    };
  }, [code]);
  return (
    <div role="img" aria-label={`QR code for ticket ${code}`} className={cn("aspect-square rounded-xl bg-white p-2 ring-1 ring-inset ring-border [&_svg]:size-full", className)} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
