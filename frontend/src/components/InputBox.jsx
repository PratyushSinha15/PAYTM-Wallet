import React from 'react'

export function InputBox ({label, placeholder, onChange})  {
  return (
    <div>
        <div className='text-sm font-medium text-left py-2'>
            {label}
        </div>
        <input type="text" 
            onChange={onChange}
            placeholder={placeholder}
            className='w-full px-2 py-1 border rounded border-slate-200' 
        />
    </div>
  )
}

//basically to acces what user is writing in input value so that  we can
//send it back to the backend we need to use the onChange event handler in the
//component and where ever i use this component i will pass the onChange event handler as a prop