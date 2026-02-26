"use client";

import { ConfigProvider, theme } from "antd";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store"; 

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#8b5cf6",
            borderRadius: 14,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ReduxProvider>
  );
}