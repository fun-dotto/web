import { ListItem } from "@/components/dotto/list-item";

export default function Loading() {
  return (
    <ul className="max-w-3xl mx-auto" aria-live="polite" aria-busy="true">
      {Array.from({ length: 10 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 並び替えのない固定数のスケルトン
        <li key={index}>
          <ListItem title="" description1="" value="" isLoading />
        </li>
      ))}
    </ul>
  );
}
