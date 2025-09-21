
import { SectionCards } from "@/components/section-cards"
import TableOverview from "@/components/table-overview"

// import data from "./data.json"

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCards />
      <TableOverview />
    </div>
  )
}
