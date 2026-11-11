import type { ReactNode } from "react";

const paths = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  diagonal: <path d="M6 18 18 6M8 6h10v10" />,
  phone: <path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a12 12 0 0 1-6-6l2-2-2-5Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  wallet: <><path d="M19 8V5H5a2 2 0 0 0 0 4h15v10H5a2 2 0 0 1-2-2V7m17 5h-4a2 2 0 0 0 0 4h4" /><path d="M16 14h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.6-3.2A8.5 8.5 0 1 1 21 11.5Z" />,
} satisfies Record<string, ReactNode>;

export default function SiteIcon({ name, size = 22 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
