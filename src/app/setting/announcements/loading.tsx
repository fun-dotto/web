import { ListItem } from "@/components/dotto/list-item";

export default function Loading() {
  return (
    <ul className="max-w-xl mx-auto" aria-live="polite" aria-busy="true">
      {Array.from({ length: 10 }).map((_, index) => (
        <li key={index}>
          <ListItem title="" description1="" value="" isLoading />
        </li>
      ))}
    </ul>
  );
}
