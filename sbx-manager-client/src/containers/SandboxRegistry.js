import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './SandboxRegistry.css'

export default function SandboxRegistry() {
    return (
        <div className="SandboxRegistry">
            <LinkContainer to="/registry/addsandbox">
                <LoaderButton block size="lg">
                    Add Sandbox
                </LoaderButton>
            </LinkContainer>
            <hr />
        </div>
    )
}
