"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Resend } from "resend"

export type CreateGroupState = {
  success: null | boolean
  message?: string
}

export async function createGroup(_previusState: CreateGroupState, formData: FormData) {
  const supabase = await createClient()

  const { data: authUser, error: authError } = await supabase.auth.getUser()

  if (authError) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar um grupo"
    }
  }

  const names = formData.getAll("name")
  const emails = formData.getAll("email")
  const groupName = formData.get("group-name")

  const { data: newGroup, error } = await supabase.from("groups").insert({
    name: groupName,
    owner_id: authUser.user.id,
  }).select().single()

  if (error) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar o grupo, tente novamente!"
    }
  }

  const participants = names.map((name, index) => ({
    group_id: newGroup.id,
    email: emails[index],
    name,
  }))

  const {
    data: createdParticipants,
    error: errorCreatedParticipants
  } = await supabase.from('participants').insert(participants).select()

  if (errorCreatedParticipants) {
    return {
      success: false,
      message: "Ocorreu um erro ao adicionar os participantes ao grupo, tente novamente!"
    }
  }

  const drawnParticipants = drawnGroup(createdParticipants)

  const { error: erroDraw } = await supabase.from('participants').upsert(drawnParticipants)

  if (erroDraw) {
    return {
      success: false,
      message: "Ocorreu um erro ao sortear os participantes do grupo, tente novamente!"
    }
  }

  const { error: errorResend } = await sendEmailToParticipants(drawnParticipants, groupName as string)

  if (errorResend) {
    return {
      success: false,
      message: errorResend
    }
  }

  redirect(`/app/groups/${newGroup.id}`)
}

type IParticipant = {
  id: string
  group_id: string
  name: string
  email: string
  assigned_to: string | null
  created_at: string
}

function drawnGroup(participants: IParticipant[]) {
  const selectedParticipants: string[] = []

  return participants.map((participant) => {
    const avaliableParticpants = participants.filter(
      (p) => p.id !== participant.id && !selectedParticipants.includes(p.id)
    )

    const assignedParticipant = avaliableParticpants[
      Math.floor(Math.random() * avaliableParticpants.length)
    ]

    selectedParticipants.push(assignedParticipant.id)

    return {
      ...participant,
      assigned_to: assignedParticipant.id,
    }
  })
}

async function sendEmailToParticipants(participants: IParticipant[], groupName: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await Promise.all(
      participants.map((participant) => {
        resend.emails.send({
          from: "",
          to: participant.email,
          subject: `Sorteio de amigo secreto - ${groupName}`,
          html: `<p>Você está participando do amigo secreto do grupo "${groupName}". <br /> <br />
          o seu amigo secreto é <strong>${participants.find((p) => p.id === participant.assigned_to)?.name}</strong>! </p>
          `
        })
      })
    )

    return { error: null }
  } catch {
    return { error: "Ocorreu um erro ao enviar os emails." }
  }
}