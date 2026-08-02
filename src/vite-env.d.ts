/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_BOARD_IMAGES_BUCKET?: string;
  readonly VITE_EVENT_FLYERS_BUCKET?: string;
}
