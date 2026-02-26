"use client";

import { ConfigProvider, theme } from "antd";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}