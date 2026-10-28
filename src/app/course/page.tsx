import { RedirectType, redirect } from "next/navigation";

export default function Page() {
  redirect("/course/subjects", RedirectType.replace);
}
