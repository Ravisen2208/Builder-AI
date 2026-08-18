import { BotIcon, BotMessageSquareIcon, UserIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import PromptInput from '../components/PromptInput'

const ChatPanel = ({messages, onsend, loading}) => {
    const bottomRef = useRef(null)

    useEffect(()=> {bottomRef.current?.scrollIntoView({behavior : "auto"})
}, [messages,loading])
  return (
    <div className=' flex flex-col h-full bg-white'>
       {/*messages */}
       <div className='flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar'>
        {messages.length === 0 && (
            <div className='flex items-center justify-center h-full '>
                <P className= " text bg-zinc-400 text-sm text-center">Ask AI to modify your website</P>
            </div>
        )}
        {messages.map ((msg, i) => (
            <div key={i}>
              <div className='flex gap-2.5 items-start'>
                <div className='shrink-0 w-6 h-6 rounded-md flex items-center
                justify-center mt-0.5 bg-zinc-50'>
                    {msg.role === "user" ? (
                        <UserIcon size={14} className='text-zine-500'/>
                    ):(
                        <BotMessageSquareIcon size={14} className='text-zine-700'/>
                    )}
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-xs font-medium text-zine-500 mb-1 uppercase tracking-wide'>
                        {msg.role === "user" ? "You" : "AI"}
                    </p>
                    <p className='text-[13px] text-zinc-700 leading tracking-wider
                    whitespace-pre-wrap wrap-break-word '>
                        {msg.content.split ("- `/").map((text,i) => (
                            <span key={i} className='block mt-3'>
                             <span className={i === 0 ? "hidden" : ""}> - `/ </span>
                             {text}
                            </span>
                        ))}</p>
                </div>
              </div>
            </div>
        ))}
        {loading &&(
            <div className='flex gap-2.5 items-start'>
             <div className='shrink-0 w-6 h-6 rounded-md flex itmes-center justify-center
             mt-0.5 bg-zine-900/5'>
                <BotIcon size= {13} className='text-zinc-900'/>
             </div>
             <div className='flex-1'>
                  <p className='text-[11px] font-medium text-zinc-400 mb-2 uppercase tracking-wide '>
                    AI
                  </p>
                  <div className='dot-loader '>
                     <span></span>
                     <span></span>
                     <span></span>
                  </div>
             </div>
            </div>
        )}
        <div ref={bottomRef}/>
       </div>
       {/*input */}
        <div className=' p-3 border-t border-zinc-200'>
            <PromptInput onSubmit = {onsend} loading={loading} placeholder ='Ask AI to  modify...'
           autoFocus   />
        </div>

    </div>
  )
}

export default ChatPanel