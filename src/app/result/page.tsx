"use client";

import WinnerResult from "@/components/WinnerResult";
import { Suspense } from "react";

const Result = () => {

  return (
    <Suspense fallback={<p>Loading...</p>}>
        <WinnerResult/>;
    </Suspense>
  ) 
}

export default Result