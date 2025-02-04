export type DialogOpenOpts = Pick<
  Electron.OpenDialogOptions,
  "title" | "defaultPath" | "buttonLabel" | "filters"
>;
