import { BOARD_IMAGES_BUCKET } from '@constants';
import { getMediaThumbnailPath } from './mediaUtils';

const appendAssetVersion = (url: string, version?: string): string => {
  if (!version) return url;
  return `${url}?v=${encodeURIComponent(version)}`;
};

export const getBoardMemberImageUrl = (filename: string | null, version?: string): string => {
  if (!filename) return '';
  return appendAssetVersion(`${BOARD_IMAGES_BUCKET}${filename}`, version);
};

export const getBoardMemberThumbnailUrl = (filename: string | null, version?: string): string => {
  if (!filename) return '';
  return appendAssetVersion(`${BOARD_IMAGES_BUCKET}${getMediaThumbnailPath(filename)}`, version);
};
