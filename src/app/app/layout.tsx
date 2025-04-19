import { Header } from "@/components/layout/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AppLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const supabase = await createClient()
  
  const {data, error} = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  )
}