import React from "react";
import { ModalsProvider, ModalsProviderProps } from "@mantine/modals";

import ContentButtonModal from "./ContentButtonModal";
import ContentButtonDeleteModal from "./ContentButtonDeleteModal";

export * from "./ContentButtonModal";
export * from "./ContentButtonDeleteModal";

/**
 * Custom Modals for the Mantine Modals provider
 */
export const modals = {
  contentButton: ContentButtonModal,
  contentButtonDelete: ContentButtonDeleteModal,
};

export default function AppModalsProvider(props: ModalsProviderProps) {
  return <ModalsProvider modals={modals} {...props} />;
}
