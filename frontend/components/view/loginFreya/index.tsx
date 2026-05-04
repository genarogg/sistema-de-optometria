'use client'
import React from 'react'
import AuthForm from './components'
import "./style/formFreya.css"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v4";
import { RECAPTCHA_KEY } from "@/env";

interface indexProps {

}

const index: React.FC<indexProps> = () => {
    return (
        <div className=" flex items-center justify-center p-4">
            {/* <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}> */}
                <AuthForm />
            {/* </GoogleReCaptchaProvider> */}
        </div>
    );
}

export default index;