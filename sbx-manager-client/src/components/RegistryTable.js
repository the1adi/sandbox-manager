import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import Table from 'react-bootstrap/Table'
import './RegistryTable.css'

// TODO 

export default function RegistryTable(props) {
    const [sandboxes, setSandboxes] = useState('Test')
    // async function getZoneSandboxes() {
    //     try {
    //         const sbxRes = await API.get(
    //             'sandbox',
    //             '/sandbox-registry/zone/' + props.zone
    //         )

    //     } catch (error) {
    //         console.log(error.response)
    //     }
    // }
    // Initialize and get sandboxes per zone
    useEffect(() => {
        console.log("CALLING FROM ZONESANDBOXES COMPONENT")
        API.get('sandbox', '/sandbox-registry/zone/' + props.zone)
            .then((sbxRes) => {
                console.log(sbxRes)
                setSandboxes(sbxRes)
            })
            .catch((error) => {
                console.log(error.response)
            })
    }, [props.zone])

    return (
        <div className="ZoneSandboxes">
            <h3>ZONE SANDBOXES: {props.zone}</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}
