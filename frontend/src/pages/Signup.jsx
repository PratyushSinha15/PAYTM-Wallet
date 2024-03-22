import React from 'react'
import {Button} from '../components/Button'
import {InputBox} from '../components/InputBox'
import {Heading} from '../components/Heading'
import {SubHeading} from '../components/SubHeading'
import {BottomWarning} from '../components/BottomWarning'

const Signup = () => {
  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
        <div className='flex flex-col justify-center'>
            <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
                <Heading label={"Sign Up"}/>
                <SubHeading label='Enter your Information to create an account'/>
                <InputBox placeholder='Pratyush' label={"First Name"}/>
                <InputBox label={"Last Name"} placeholder='Sinha'/>
                <InputBox label={"Email"} placeholder='yourmail@gmail.com'/>
                <InputBox label={"Password"} placeholder='Your password'/>
                <div className="pt-4">
                    <Button label={"Sign up"} />
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}/>
            </div>
        </div>
        
    </div>
  )
}

export default Signup