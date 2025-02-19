import { openDeleteModal, DeleteModalProps } from "../../../../modals";

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
  return openDeleteModal(
    {
      text,
      ...opts.props,
    },
    {
      title,
    }
  );
};

export default openContentDeleteModal;
