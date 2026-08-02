export const getMediaThumbnailPath = (fullSizePath: string): string => {
  const separatorIndex = fullSizePath.lastIndexOf('/');
  const directory = separatorIndex === -1 ? '' : fullSizePath.slice(0, separatorIndex + 1);
  const filename = fullSizePath.slice(separatorIndex + 1);
  const thumbnailFilename = filename.replace(/\.(png|webp|jpeg|jpg)$/i, '.jpg');

  return `${directory}thumbnails/${thumbnailFilename}`;
};
