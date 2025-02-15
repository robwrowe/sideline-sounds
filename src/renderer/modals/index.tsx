import React from "react";
import { ModalsProvider, ModalsProviderProps } from "@mantine/modals";

import AudioFileModal from "./AudioFileModal";
import ContentButtonDeleteModal from "./ContentButtonDeleteModal";
import ContentButtonModal from "./ContentButtonModal";

export * from "./AudioFileModal";
export * from "./ContentButtonModal";
export * from "./ContentButtonDeleteModal";

/**
 * Custom Modals for the Mantine Modals provider
 */
export const modals = {
  audioFile: AudioFileModal,
  contentButton: ContentButtonModal,
  contentButtonDelete: ContentButtonDeleteModal,
};

export default function AppModalsProvider(props: ModalsProviderProps) {
  return <ModalsProvider modals={modals} {...props} />;
}
