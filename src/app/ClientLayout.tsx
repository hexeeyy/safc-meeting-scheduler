"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
// import { store } from "@/store/store";
import { Toaster } from "sonner";
// import { DialogProvider } from "@/providers/DialogProvider";
// import QueryProvider from "@/providers/QueryProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";

function AuthChecker({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {/* <Provider store={store}> */}
        {/* <QueryProvider> */}
          <Toaster position="bottom-right" richColors />
          <AuthChecker>
            {/* <DialogProvider> */}
              <div className="flex min-h-screen flex-col">
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            {/* </DialogProvider> */}
          </AuthChecker>
        {/* </QueryProvider> */}
      {/* </Provider> */}
    </SessionProvider>
  );
}