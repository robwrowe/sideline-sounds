import { ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";
import { AudioFileMetadata } from "../../types";
import { parseBlob } from "music-metadata-browser";

// send the audio file to the renderer process as an array buffer
ipcMain.handle("audio:fileBuffer", async (_, relativePath: string) => {
  // const filePath = path.resolve(__dirname, relativePath);
  const filePath = path.resolve(relativePath);

  const fileBuffer: ArrayBuffer = await fs.readFile(filePath);

  return fileBuffer;
});

// send the audio metadata to the renderer process
ipcMain.handle(
  "audio:metadata",
  async (_, relativePath: string): Promise<AudioFileMetadata> => {
    const filePath = path.resolve(relativePath);

    const fileBuffer: ArrayBuffer = await fs.readFile(filePath);

    const metadata = await parseBlob(new Blob([fileBuffer]));

    const cover = metadata.common.picture?.[0]; // get the first image

    const coverBase64 = cover
      ? `data:${cover.format};base64,${Buffer.from(cover.data).toString("base64")}`
      : null;

    return { ...metadata, cover: coverBase64 };
  }
);
