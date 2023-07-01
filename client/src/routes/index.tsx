import { startChat } from "../state"
import { TargetedEvent } from "preact/compat"

export function Index({ }: { path: string }) {
    const handleStartClick = (ev: TargetedEvent<HTMLFormElement>) => {
        ev.preventDefault()

        const formData = new FormData(ev.currentTarget)
        const username = String(formData.get('username') ?? '')
        const room = String(formData.get('room') ?? '')

        startChat(username, room)
    }

    return <main class='h-full w-full flex items-center justify-center flex-col'>
        <h1 class='font-semibold text-3xl bg-gradient-to-t from-pink-400 to-red-400 bg-clip-text text-transparent mb-2'>Let's get started</h1>
        <p class='font-medium text-sm text-gray-500 mb-10'>Please, enter your data.</p>
        <form onSubmit={handleStartClick} class='text-center' autocomplete='off'>
            <input name='username' class='bg-white/10 outline-none px-4 py-2 rounded-full max-w-xs w-full placeholder:text-gray-500 font-medium text-sm mb-2' placeholder='Username' />
            <input name='room' class='bg-white/10 outline-none px-4 py-2 rounded-full max-w-xs w-full placeholder:text-gray-500 font-medium text-sm mb-4' placeholder='Room name' />
            <button type='submit' class='bg-white/10 outline-none px-4 py-2 rounded-full max-w-xs w-full font-medium text-sm hover:bg-pink-400 text-center transition-colors'>Connect</button>
        </form>
    </main>
}