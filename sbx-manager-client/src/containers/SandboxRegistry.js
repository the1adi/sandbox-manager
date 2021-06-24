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
    const [key, setKey] = useState(zones[0])
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
            <>
                <Tabs
                    id="controlled-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    {zones.map((zone) => (
                        <Tab key={zone} eventKey={zone} title={zone}>
                            <RegistryTable zone={zone}></RegistryTable>
                        </Tab>
                    ))}
                </Tabs>
            </>
            <hr />
        </div>
    )
}
