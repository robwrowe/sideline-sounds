import { openDeleteModal, DeleteModalProps } from "../../modals";

type AudioFileDeleteModalOpts = {
  fileName: string;
  id: string;
  props?: Partial<DeleteModalProps>;
};

const openAudioFileDeleteModal = (opts: AudioFileDeleteModalOpts) => {
  return openDeleteModal(
    {
      text: `Are you sure you want to delete the audio file "${opts.fileName}"?`,
      ...opts.props,
    },
    {
      title: "Delete Audio File",
      id: `delete-audio-file-${opts.id}`,
    }
  );
};

export default openAudioFileDeleteModal;
