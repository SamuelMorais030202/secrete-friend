import { NewGroupForm } from "@/components/new-group-form"
import { createClient } from "@/utils/supabase/server"

export default async function NewGroup() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  const loggedUser = {
    id: data.user?.id as string,
    email: data.user?.email as string,
  }

  return (
    <div className="mt-24 mb-4">
      <NewGroupForm loggendUser={loggedUser} />
    </div>
  )
}