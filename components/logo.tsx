import { LucideWand2 } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
        <LucideWand2 className="h-6 w-6 text-white" />
      </div>
      <span className="font-bold text-xl">SceneGen</span>
    </div>
  )
}

