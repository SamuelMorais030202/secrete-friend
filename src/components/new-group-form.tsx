"use client"

import { useActionState, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Loader, Mail, Trash2 } from "lucide-react"
import { Separator } from "./ui/separator"
import { createGroup, CreateGroupState } from "@/app/app/groups/new/actions"
import { toast } from "sonner"

interface IParticipant {
  name: string
  email: string
}

type LoggendUser = {
  id: string
  email: string
}

interface INewGroupFormProps {
  loggendUser: LoggendUser
}

export function NewGroupForm({ loggendUser }: INewGroupFormProps) {
  const [participants, setParticipants] = useState<IParticipant[]>([
    { name: "", email: loggendUser.email },
  ])

  const [state, formAction, pending] = useActionState<CreateGroupState, FormData>(
    createGroup,
    {
      success: null,
      message: "",
    }
  )

  const [groupName, setGroupName] = useState("")

  function updateParticipants(index: number, field: keyof IParticipant, value: string) {
    const updatedParticipants = [...participants]
    updatedParticipants[index][field] = value
    setParticipants(updatedParticipants)
  }

  function removeParticipant(index: number) {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  function addParticipant() {
    setParticipants((prevState) => ([
      ...prevState,
      { email: "", name: "" }
    ]))
  }

  useEffect(() => {
    if (state.success === false) {
      toast("", {
        description: state.message,
      })
    }
  }, [state])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo grupo</CardTitle>
        <CardDescription>
          Convide seus amigoa para participar
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nome do grupo</Label>
            <Input
              id="group-name"
              name="group-name"
              value={groupName}
              onChange={(event) => setGroupName((event.target.value))}
              placeholder="Digite o nome do grupo"
              required
            />
          </div>

          <h2 className="!mt-12">Participants</h2>

          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow space-y-2 w-full">
                  <Label htmlFor={`name-${index}`}>Nome</Label>
                  <Input
                    id={`name-${index}`}
                    name="name"
                    value={participant.name}
                    onChange={(event) => {
                      updateParticipants(index, "name", event.target.value)
                    }}
                    placeholder="Digite o nome da pessoa"
                    required
                  />
                </div>

                <div className="flex-grow space-y-2 w-full">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    id={`email-${index}`}
                    name="email"
                    value={participant.email}
                    type="email"
                    onChange={(event) => {
                      updateParticipants(index, "email", event.target.value)
                    }}
                    placeholder="Digite o email da pessoa"
                    className="readonly:text-muted-foreground"
                    readOnly={participant.email === loggendUser.email}
                    required
                  />
                </div>

                <div className="min-w-9">
                  {
                    participants.length > 1 && participant.email !== loggendUser.email && (
                      <Button
                        type="button"
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() => removeParticipant(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <Separator className="my-4" />

        <CardFooter className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={addParticipant}
            className="w-full md:w-auto cursor-pointer"
          >
            Adicionar amigo
          </Button>

          <Button
            type="submit"
            className="flex items-center space-x-2 w-full md:w-auto cursor-pointer"
          >
            <Mail className="sixe-3" />
            Criar grupo e enviar e-mails
            {
              pending && <Loader className="animate-spin" />
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}