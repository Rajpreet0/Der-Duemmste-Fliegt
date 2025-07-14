"use client";

import WinnerResult from "@/components/WinnerResult";
import { Suspense } from "react";

export default function ResultPage() {
  return(
    <Suspense fallback="Loading...">
        <WinnerResult />
    </Suspense>
  ) ;
}
