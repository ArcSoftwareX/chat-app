import { signal } from "@preact/signals";
import { route } from "preact-router";

export const appState = signal<{ username: string | null, room: string | null }>({
    username: null,
    room: null
})

export const startChat = (username: string, room: string) => {
    if (username.trim().length === 0) return
    if (room.trim().length === 0) return

    appState.value = { username, room }
    route("/chat", true)
}

export const isChatStarted = () => {
    return appState.value.room !== null && appState.value.username !== null
}

export const chatState = signal<{ messages: Message[], error: boolean, loaded: boolean }>({
    error: false,
    messages: [],
    loaded: false
})

export const startMessageBroadcast = () => {
    const evs = new EventSource('/events')

    evs.addEventListener('open', () => {
        chatState.value = { ...chatState.value, loaded: true }
    })

    evs.addEventListener('message', ev => {
        const message = JSON.parse(ev.data) as Message
        if (message.room === appState.value.room) chatState.value = { ...chatState.value, messages: [ ...chatState.value.messages, message ] }
    })

    evs.addEventListener('error', () => {
        chatState.value = { ...chatState.value, error: true, loaded: true }
    })
}

export const sendMessage = async (text: string) => {
    if (text.trim().length === 0) return

    const res = await fetch('/message', {
        method: 'POST',
        body: new URLSearchParams({ message: text.trim(), room: appState.value.room ?? '', username: appState.value.username ?? '' })
    })

    console.log(await res.text());
}

interface Message {
    username: string,
    message: string,
    room: string
}