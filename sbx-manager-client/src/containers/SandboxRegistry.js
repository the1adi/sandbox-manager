import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import LoaderButton from '../components/LoaderButton'
import RegistryTable from '../components/RegistryTable'
import { useAppContext } from '../libs/contextLib'
import './SandboxRegistry.css'

export default function SandboxRegistry() {
    const { isAuthenticated } = useAppContext()
    return (
        <div className="SandboxRegistry">
            <div className="lander">
                <h1>Sandbox Registry</h1>
            </div>
            {isAuthenticated ? (
                <LinkContainer style={{ float: 'right' }} to="/addsandbox">
                    <LoaderButton size="sm">Add Sandbox</LoaderButton>
                </LinkContainer>
            ) : (
                <></>
            )}
            <LinkContainer to="/newsandboxrequest">
                <LoaderButton size="sm">Request New Sandbox</LoaderButton>
            </LinkContainer>
            <RegistryTable></RegistryTable>
            <hr />
        </div>
    )
}
