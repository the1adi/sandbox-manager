import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import './RegistryTable.css'

// TODO

export default function RegistryTable(props) {
    const [sandboxes, setSandboxes] = useState(['0'])
    // Initialize and get sandboxes per zone
    useEffect(() => {
        console.log('CALLING FROM RegistryTable COMPONENT')
        API.get('sandbox', '/sandbox-registry/zone/' + props.zone)
            .then((sbxRes) => {
                console.log(sbxRes.Items)
                setSandboxes(sbxRes.Items)
            })
            .catch((error) => {
                console.log(error.response)
            })
    }, [props.zone])

    return (
        <div className="RegistryTable">
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
                                <LinkContainer size="sm" to="/sandboxrequest">
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
        </div>
    )
}
