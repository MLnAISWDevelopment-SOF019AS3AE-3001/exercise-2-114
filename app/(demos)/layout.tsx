import type { ReactNode } from "react";
import { CourseShell } from "@/components/layout/course-shell";

export default function DemosLayout({ children }: { children: ReactNode }) {
  return <CourseShell>{children}</CourseShell>;
}
