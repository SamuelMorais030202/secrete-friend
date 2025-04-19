"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

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
    { name: "", email: loggendUser.email }
  ])

  const [groupName, setGroupName] = useState("")

  function updateParticipants(index: number, field: keyof IParticipant, value: string) {
    const updatedParticipants = [...participants]
    updatedParticipants[index][field] = value
    setParticipants(updatedParticipants)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo grupo</CardTitle>
        <CardDescription>
          Convide seus amigoa para participar
        </CardDescription>
      </CardHeader>

      <form action="">
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

          <div>
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
              </div>
            ))}
          </div>
        </CardContent>
      </form>
    </Card>
  )
}