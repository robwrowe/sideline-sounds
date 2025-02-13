import { modals } from "@mantine/modals";
import { ContentButtonModalProps } from "../../../../modals";

type OpenContentButtonModalOpts = {
  title?: string;
  props?: ContentButtonModalProps;
};

const openContentButtonModal = (opts: OpenContentButtonModalOpts = {}) => {
  const title = opts?.title || "Content Button Properties";

  return modals.openContextModal({
    modal: "contentButton",
    title,
    innerProps: {
      ...opts?.props,
    },
  });
};

export default openContentButtonModal;
