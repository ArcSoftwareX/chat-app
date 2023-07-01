import { JSX } from 'preact'

export enum CardType {
    Info,
    Error
}

export const Card = ({ children, type = CardType.Info }: { children: JSX.Element | string, type?: CardType }) => {
    return <div class={`rounded-full border font-semibold px-4 py-2 ${ type === CardType.Info ? 'border-white/10 bg-neutral-500/10' : 'border-red-500/30 bg-red-500/10' }`}>{ children }</div>
}