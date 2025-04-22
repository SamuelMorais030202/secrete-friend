import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TextRevealCard, TextRevealCardTitle } from "@/components/ui/text-reveal"
import { createClient } from "@/utils/supabase/server"

export default async function PageGroup({
  params
 }: {
  params: Promise<{ id: string }>
 }) {
  const supabase = await createClient()
  const groupId = (await params).id

  const { data: authUser } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("groups")
    .select(`
      id,
      name,
      participants (*)
    `).eq("id", groupId).single()

  if (error) {
    return <p>Erro ao carregar o grupo</p>
  }

  // Busca o id da pesso que o usuário autenticado tirou
  const assignedParticipantId = data?.participants.find(
    (p) => authUser.user?.email === p.email
  )?.assigned_to

  // Pega os dados da pessoa que foi sorteada pelo usuário autenticado
  const assignedParticipant = data.participants.find(
    (p) => p.id === assignedParticipantId
  )

  return (
    <main className="container mx-auto py-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Grupo
              {' '}
              <span className="font-light underline decoration-green-500">
                {data.name}
              </span>
            </CardTitle>
          </div>

          <CardDescription>
            Informações do grupo e participantes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            Participantes
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <TextRevealCard
            text="Passe o mouse para revelar"
            revealText={assignedParticipant.name}
          >
            <TextRevealCardTitle>
              Seu amigo secreto
            </TextRevealCardTitle>
          </TextRevealCard>
        </CardContent>
      </Card>
    </main>
  )
}