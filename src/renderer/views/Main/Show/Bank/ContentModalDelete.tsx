import { modals } from "@mantine/modals";
import { DeleteModalProps } from "../../../../modals";

type OpenContentButtonDeleteModalOpts = {
  title?: string;
  props?: Partial<DeleteModalProps>;
  buttonName?: string;
};

const openContentDeleteModal = (
  opts: OpenContentButtonDeleteModalOpts = {}
) => {
  const title = opts?.title || "Remove Content Button";
  const text = `Are you sure you want to delete ${opts?.buttonName ?? "this button"}?`;

  return modals.openContextModal({
    modal: "deleteModal",
    title,
    centered: true,
    overlayProps: {
      backgroundOpacity: 0.55,
      blur: 3,
    },
    innerProps: {
      text,
      ...opts?.props,
    },
  });
};

export default openContentDeleteModal;
