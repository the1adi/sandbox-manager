import React, { useState } from 'react'
// import Nav from 'react-bootstrap/Nav'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { LinkContainer } from 'react-router-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { zones } from '../libs/mappingsLib'
import RegistryTable from '../components/RegistryTable'
import './SandboxRegistry.css'

export default function SandboxRegistry() {
    const [key, setKey] = useState(zones[0])
    return (
        <div className="SandboxRegistry">
            <LinkContainer to="/registry/addsandbox">
                <LoaderButton block size="sm">
                    Add Sandbox
                </LoaderButton>
            </LinkContainer>
            <>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    {zones.map((zone) => (
                        <Tab key={zone} eventKey={zone} title={zone}>
                            {key}
                            {/* <ZoneSandboxes zone={zone}/> */}
                            {/* <Sonnet /> */}
                        </Tab>
                    ))}
                </Tabs>
            </>
            <hr />
        </div>
    )
}
