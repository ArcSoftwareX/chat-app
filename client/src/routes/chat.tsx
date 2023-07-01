import { useEffect } from "preact/hooks"
import { appState, chatState, isChatStarted, sendMessage, startMessageBroadcast } from "../state"
import { route } from "preact-router"
import { Card, CardType } from "../components/ui/Card"
import { TargetedEvent } from "preact/compat"
import { ActivityIndicator } from "../components/ui/ActivityIndicator"

export function Chat({ }: { path: string }) {
    useEffect(() => {
        if (!isChatStarted()) {
            route('/', true)
            return
        }

        startMessageBroadcast()
    }, [])

    const handleSendClick = (ev: TargetedEvent<HTMLFormElement>) => {
        ev.preventDefault()

        const formData = new FormData(ev.currentTarget)
        const message = String(formData.get('message') ?? '')

        sendMessage(message)
    }

    return <main class='h-full w-full'>
        <h1 class='font-semibold text-xl flex items-center gap-2 w-full px-4 h-16 backdrop-blur-sm border-b border-b-white/10 fixed top-0 inset-x-0'>
            Chat
            <div class='rounded-full bg-white/10 px-2 py-1 text-xs font-semibold'>in { appState.value.room }</div>
        </h1>
        <div class='flex h-full flex-col justify-end px-4 pt-20 pb-16'>
            { chatState.value.messages.map((msg, idx) => <div key={idx} class={`${ appState.value.username === msg.username ? 'self-end bg-pink-400' : 'self-start bg-white/10' } px-4 py-2 rounded-xl`}>
                <p class='text-sm font-semibold'>{ msg.username }</p>
                { msg.message }
            </div>) }
        </div>
        <form onSubmit={handleSendClick} class='fixed bottom-0 inset-x-0 p-2'>
            <input name='message' class='bg-white/10 outline-none px-4 py-2 rounded-full w-full placeholder:text-gray-500 font-medium text-sm mb-2 backdrop-blur-sm' placeholder='Type a message...' />
        </form>


        {/* Overlay stuff */}

        { !chatState.value.loaded ? <div class='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
            <ActivityIndicator class='text-4xl text-pink-400' />
        </div> : null }

        { chatState.value.error ? <div class='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
            <Card type={CardType.Error}>An error occured while connecting to server</Card>
        </div> : null }
    </main>
}