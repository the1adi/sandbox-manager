import React, { useState } from 'react'
// import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { LinkContainer } from 'react-router-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { zones } from '../libs/mappingsLib'
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
            <RegistryTable></RegistryTable>
            <hr />
        </div>
    )
}
