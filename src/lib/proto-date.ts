import type { Date as ProtoDate } from "@/api/google/type/date_pb";

/** google.type.Date を "YYYY-MM-DD" 形式の文字列に変換する。 */
export function protoDateToIsoString(date: ProtoDate | undefined): string {
  if (!date) return "";
  const yyyy = String(date.year).padStart(4, "0");
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
