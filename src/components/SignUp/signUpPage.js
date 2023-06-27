import React, { lazy, Suspense } from "react";

const SignUp = lazy(() => import("./SignUp"));

export const SignUpPage = () => (
  <Suspense fallback={<div>Page is Loading...</div>}>
    <SignUp />
  </Suspense>
);
