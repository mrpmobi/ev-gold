import { UserPlus } from "lucide-react"

export default function PageHeader() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <UserPlus className="w-6 h-6 text-blue-500" />
      <h1 className="text-xl font-semibold text-blue-500">Cadastro Consultores Mobi</h1>
    </div>
  )
}
