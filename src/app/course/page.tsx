import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  redirect("/course/subjects", RedirectType.replace);
}
