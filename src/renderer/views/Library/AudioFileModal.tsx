import { modals } from "@mantine/modals";
import { AudioFileModalProps } from "../../modals";

type AudioFileModalOpts = {
  title?: string;
  props: AudioFileModalProps;
};

const openAudioFileModal = (opts: AudioFileModalOpts) => {
  const title = opts?.title || "Audio File Editor";

  return modals.openContextModal({
    modal: "audioFile",
    title,
    innerProps: { ...opts.props },
    size: "60rem",
  });
};

export default openAudioFileModal;
