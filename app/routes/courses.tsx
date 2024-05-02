import { cn } from "@/lib/utils"
import { Users } from "lucide-react"

interface CourseCardProps {
  title: string,
  groups: {
    code: string,
    members: number
  }[]
}

const CourseCard = ({ title, groups }: CourseCardProps) => {
  return (
    <div className="outline outline-1 outline-slate-600 p-6 min-w-72 max-w-96">
      <h2 className="text-2xl font-extrabold mb-3">{title}</h2>
      <ul className="outline outline-1 outline-zinc-400 rounded-sm flex flex-col relative">
        { groups.map((group, index) => (
          <div className={cn(
            "px-2 hover:bg-muted",
            index !== 0 ? "border-t border-zinc-400" : ""
          )} key={index}>
            <li className="flex items-center gap-4 my-auto h-9 text-sm">
              <span className="text-base">{group.code}</span>
              <span className="ml-auto">{group.members}<Users className="inline w-[1rem] h-[1rem] ml-[0.2rem] mb-[0.2rem] text-muted-foreground"/></span>
            </li>
          </div>
        )) }
      </ul>
    </div>
  )
}

function CourseScreen() {
  return (
    <div className="grid grid-cols-3 gap-10 ml-10 mt-10 mb-10">
      <CourseCard title='Math' groups={[
        { code: 'MATH101', members: 10 },
        { code: 'MATH102', members: 12 },
        { code: 'MATH103', members: 8 }
      ]}/>
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 },
        { code: 'PHYS102', members: 10}
      ]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
      <CourseCard title='Physics' groups={[{ code: 'PHYS101', members: 15 }]} />
    </div>
  )
}

export default CourseScreen;
