import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { zones } from '../libs/mappingsLib'
import { LinkContainer } from 'react-router-bootstrap'
import { onError } from '../libs/errorLib'
import './RegistryTable.css'

// TODO

export default function RegistryTable(props) {
    const [sandboxes, setSandboxes] = useState(['0'])
    const [key, setKey] = useState(zones[0])
    // Initialize and get sandboxes per zone
    useEffect(() => {
        API.get('sandbox', '/sandbox-registry/zone/' + key)
            .then((sbxRes) => {
                // console.log(sbxRes.Items)
                setSandboxes(sbxRes.Items)
            })
            .catch((error) => {
                console.log(error.response)
                onError(error)
            })
    }, [key])

    return (
        <div className="RegistryTable">
            <Tabs
                id="controlled-tab"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
                {' '}
                {/* {console.log(zones)} */}
                {zones.map((zone) => (
                    <Tab
                        key={zone}
                        eventKey={zone}
                        title={zone}
                    >
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Pending Requests</th>
                                    <th>Sandbox</th>
                                    <th>URL</th>
                                    <th>Admins</th>
                                    <th>Users</th>
                                    <th>Allocation Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sandboxes.map((sb) => (
                                    <tr key={sb}>
                                        <td>
                                            <LinkContainer
                                                size="sm"
                                                to={`/sandboxrequest/${zone}/${sb.num}/${sb.realm}`}
                                            >
                                                <Button>Request Access</Button>
                                            </LinkContainer>
                                        </td>
                                        <td>TODO</td>
                                        <td>
                                            dev{sb.num}-{sb.realm}
                                        </td>
                                        <td>{sb.url}</td>
                                        <td>{sb.admins}</td>
                                        <td>{sb.users}</td>
                                        <td>{sb.allocationDetails}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}
