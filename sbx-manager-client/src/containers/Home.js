import React from 'react'
import './Home.css'
import SandboxRequest from './SandboxRequest'

export default function Home() {
    return (
        <div className="Home">
            <div className="lander">
                <h1>Sandbox Request</h1>
                <p className="text-muted">
                    Please submit a sandbox request using the form below
                </p>
            </div>
            <SandboxRequest className="form"></SandboxRequest>
        </div>
    )
}
