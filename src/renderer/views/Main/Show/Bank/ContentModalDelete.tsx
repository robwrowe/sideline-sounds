import { modals } from "@mantine/modals";
import { ContentButtonDeleteModalProps } from "../../../../modals";

type OpenContentButtonDeleteModalOpts = {
  title?: string;
  props?: ContentButtonDeleteModalProps;
};

const openContentButtonDeleteModal = (
  opts: OpenContentButtonDeleteModalOpts = {}
) => {
  const title = opts?.title || "Remove Content Button";

  return modals.openContextModal({
    modal: "contentButtonDelete",
    title,
    centered: true,
    overlayProps: {
      backgroundOpacity: 0.55,
      blur: 3,
    },
    innerProps: {
      ...opts?.props,
    },
  });
};

export default openContentButtonDeleteModal;
