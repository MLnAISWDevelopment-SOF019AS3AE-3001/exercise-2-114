import type { DriveStep } from "driver.js";

export const TOUR_STEPS: DriveStep[] = [
  {
    element: '[data-tour="hero"]',
    popover: {
      title: "RAG Builder",
      description:
        "This course app is the RAG Builder. Sign in, open it, then upload a document and ask a question.",
      side: "bottom",
      align: "start",
    },
  },
];
