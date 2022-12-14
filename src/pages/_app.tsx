import React from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import { AnimatePresence } from "framer-motion";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  router,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={session}>
          <Component key={router.pathname} {...pageProps} />
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
};

export default trpc.withTRPC(MyApp);
