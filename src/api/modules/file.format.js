import type { FileAttribute, SupportFile } from "../resources/media/file.model";

const Video = ["avi", "mp4", "mpg", "mov", "wmv"];
const Audio = ["aac", "au", "mid", "mp3", "ra", "snd", "wma", "wav"];
const Image = ["bmp", "eps", "gif", "jpg", "pict", "png", "psd", "tif", "jpeg"];
const Text = ["asc", "doc", "docx", "rtf", "msg", "pdf", "txt", "wpd", "wps"];
const Compressed = ["arc", "arj", "gz", "hqx", "rar", "sit", "tar", "z", "zip"];

const SupportedFiles: SupportFile[] = [
  { type: "TEXT", value: Text },
  { type: "VIDEO", value: Video },
  { type: "AUDIO", value: Audio },
  { type: "IMAGE", value: Image },
  { type: "COMPRESSED", value: Compressed },
];

const extractExtension = (file) => {
  const mimeType = file.mimetype;
  const mimeExt = mimeType.split("/");
  if (mimeExt.length > 1) {
    return mimeExt[1];
  }
  throw "File extension is not found";
};

const fileAttribute: FileAttribute = (extension: string) => {
  for (let i = 0; i < SupportedFiles.length; i++) {
    const fileFormatObject: SupportFile = SupportedFiles[i];
    if (fileFormatObject.value.includes(extension)) {
      return { type: fileFormatObject.type, extension };
    }
  }
  console.log(extension)
  throw "File is not supported";
};

export const getFileAttribute: FileAttribute = (file) => {
  const extension = extractExtension(file);
  return fileAttribute(extension);
};
