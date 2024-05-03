
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Book, Users, CirclePlus, CircleCheck, LucideIcon, BrainCircuitIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import lensLogo from './assets/lens_logo.svg'
import { title } from 'process'

interface NavProps {
  links: {
    title: string,
    icon: LucideIcon,
    location: string,
  }[]
}

function Dashboard() {
  const links = [
    { title: 'Courses', icon: Book, location: 'courses' },
    { title: 'Groups', icon: Users, location: 'groups' },
    { title: 'Student Submissions', icon: CircleCheck, location: 'submissions' },
    { title: 'Create Assignment', icon: CirclePlus, location: 'new-assignment' },
    { title: 'AI Analyzer', icon: BrainCircuitIcon, location: 'ai-analyzer' }
  ]
  return <TooltipProvider>
    <div className="flex">
      <MainNav links={links} />
      <Outlet/>
    </div>
  </TooltipProvider>
}

function MainNav(props: NavProps) {
  return (
    <div
      className="group flex flex-col gap-4 py-2 w-14 bg-secondary h-screen"
    >
      <img src={lensLogo} alt="Lens Logo" className="w-12 h-12 p-1 mb-6 mx-auto" />
      <nav className="grid gap-2 px-2 justify-center">
        {
          props.links.map((link, index) => (
            <Tooltip key={index} delayDuration={1200}>
              <TooltipTrigger asChild>
                <Link to={link.location} className={cn(
                  buttonVariants({ variant: 'secondary', size: 'icon' }),
                  "h-10 w-14"
                )}>
                  <link.icon className="h-5 w-5"></link.icon>
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>
                {link.title}
              </TooltipContent>
            </Tooltip>
          ))
        }
      </nav>
    </div>
    
  )
}

export default Dashboard
