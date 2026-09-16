const DEFAULT_BACKEND_URL = 'https://api.nyutamid.org/v1';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;
export const BOARD_IMAGES_BUCKET = import.meta.env.VITE_BOARD_IMAGES_BUCKET as string;
export const EVENT_FLYERS_BUCKET = import.meta.env.VITE_EVENT_FLYERS_BUCKET as string;

// INV3: 'mentorship_application_open' / 'mentorship_application_url' are backend
// WIRE-contract config KEY string literals. The Programs page is a rebrand of the
// old Mentorship page, but these key strings MUST stay byte-identical because the
// backend site-config store keys off them. Do NOT rename the quoted literals.
export const MENTORSHIP_APPLICATION_CONFIG_DEFAULTS: Record<
  'mentorship_application_open' | 'mentorship_application_url',
  string
> = {
  mentorship_application_open: 'false',
  mentorship_application_url: '',
};
// Optional detail shown on the public /apply page while applications are open.
// Plain strings, all optional; empty means "do not show". Managed from the admin
// console Overview card alongside the two INV3 keys above.
export const APPLICATION_CYCLE_CONFIG_DEFAULTS: Record<
  'application_cycle_label' | 'application_deadline' | 'application_note' | 'coffee_chat_url',
  string
> = {
  application_cycle_label: '',
  application_deadline: '',
  application_note: '',
  coffee_chat_url: '',
};
export const MENTORSHIP_APPLICATION_CONFIG_TTL_MS = 60 * 60 * 1000;
export const MENTORSHIP_APPLICATION_CONFIG_STORAGE_KEY = 'programs:mentorshipApplicationConfig';
