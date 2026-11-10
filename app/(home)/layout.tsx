import type { ReactNode } from "react";
import { CourseShell } from "@/components/layout/course-shell";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <CourseShell>{children}</CourseShell>;
}
