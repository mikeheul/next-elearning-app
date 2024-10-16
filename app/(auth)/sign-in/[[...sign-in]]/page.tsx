import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className='flex w-full justify-center items-center p-6'>
            <SignIn />
        </div>
    )
}