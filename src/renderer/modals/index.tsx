import React from "react";
import { ModalsProvider, ModalsProviderProps } from "@mantine/modals";

import ContentButtonModal from "./ContentButtonModal";

export * from "./ContentButtonModal";

/**
 * Custom Modals for the Mantine Modals provider
 */
export const modals = {
  contentButton: ContentButtonModal,
};

export default function AppModalsProvider(props: ModalsProviderProps) {
  return <ModalsProvider modals={modals} {...props} />;
}
