import React from "react";
import { ModalsProvider, ModalsProviderProps } from "@mantine/modals";

import AudioFileModal from "./AudioFileModal";
import DeleteModal from "./DeleteModal";
import ContentButtonModal from "./ContentButtonModal";

export * from "./AudioFileModal";
export * from "./ContentButtonModal";
export * from "./DeleteModal";

/**
 * Custom Modals for the Mantine Modals provider
 */
export const modals = {
  audioFile: AudioFileModal,
  contentButton: ContentButtonModal,
  deleteModal: DeleteModal,
};

export default function AppModalsProvider(props: ModalsProviderProps) {
  return <ModalsProvider modals={modals} {...props} />;
}
