

"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/firebase";


const PaymentSuccessModal = () => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgUrl = searchParams.get("imgUrl");
  const index = searchParams.get("index") || "1";
  const hasDownloaded = useRef(false); // ✅ Prevent multiple runs

  useEffect(() => {
if (imgUrl && !hasDownloaded.current) {
      hasDownloaded.current = true; // ✅ Mark as done
      setOpen(true);
      setLoading(true);
      console.log(imgUrl);
      
      downloadPaidImage(imgUrl, `premium-image-${index}.png`);
    }
  }, [imgUrl]);

  const downloadPaidImage = async (imageUrl: string, fileName: string) => {
    try {
      const downloadImage = httpsCallable(functions, "downloadImage");
      const result = await downloadImage({ url: imageUrl });

      const { base64, mimeType } = result.data as {
        base64: string;
        mimeType: string;
      };

      const response = await fetch(`data:${mimeType};base64,${base64}`);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      setLoading(false);
      setDone(true);
      setOpen(false);
      setDone(false);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setError("حدث خطأ أثناء التحميل، حاول مجددًا.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-center space-y-4">
        {loading && (
          <>
            <Loader2 className="animate-spin mx-auto text-purple-600 w-10 h-10" />
            <h2 className="text-lg font-bold">جارٍ معالجة الدفع...</h2>
            <p className="text-muted-foreground">نقوم بتنزيل الصورة الآن</p>
          </>
        )}
        {done && (
          <>
            <CheckCircle className="text-green-500 mx-auto w-10 h-10" />
            <h2 className="text-lg font-bold text-green-600">✅ تم الدفع بنجاح!</h2>
            <p className="text-muted-foreground">تم تحميل الصورة تلقائيًا</p>
          </>
        )}
        {error && (
          <>
            <h2 className="text-lg font-bold text-red-600">حدث خطأ</h2>
            <p className="text-sm text-red-500">{error}</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;

