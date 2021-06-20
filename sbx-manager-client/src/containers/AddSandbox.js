import React, { useState } from 'react'
import { API } from 'aws-amplify'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useFormFields } from '../libs/hooksLib'
import { onError } from '../libs/errorLib'
import './Home.css'
import Col from 'react-bootstrap/esm/Col'
import 'react-datepicker/dist/react-datepicker.css'
import { zones, realms } from '../libs/mappingsLib'

export default function AddSandbox() {
    // Setting Defauls
    const history = useHistory()
    const [isChanging, setIsChanging] = useState(false)
    const [fields, handleFieldChange] = useFormFields({
        realm: realms[0],
        num: '',
        zone: zones[0],
        url: '',
    })

    // Form Validation
    function validateForm() {
        return (
            fields.num.length > 0 &&
            fields.num.length < 3 &&
            fields.url.length > 0
        )
    }

    // Handle Submit for form
    async function handleSubmit(event) {
        event.preventDefault()

        setIsChanging(true)

        const params = {
            body: {
                realm: fields.realm,
                num: fields.num,
                zone: fields.zone,
                url: fields.url,
            },
            // headers: {}, // OPTIONAL
        }

        try {
            await API.post('sandbox', '/sandbox-registry', params)
            history.push('/')
        } catch (e) {
            onError(e)
            setIsChanging(false)
        }
    }

    return (
        <div className="Home">
            <div className="lander">
                <h1>Add Sandbox to Registry</h1>
                <p className="text-muted">Enter Sandbox Details below</p>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} size="lg" controlId="realm">
                        <Form.Label>Select Realm</Form.Label>
                        <Form.Control
                            autoFocus
                            as="select"
                            value={fields.realm}
                            onChange={handleFieldChange}
                        >
                            {realms.map((realm) => (
                                <option key={realm}>{realm}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="num">
                        <Form.Label>Sandbox Number</Form.Label>
                        <Form.Control
                            type="input"
                            maxLength="2"
                            minLength="2"
                            placeholder="Enter the 2 digit sandbox number"
                            value={fields.num}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="zone">
                        <Form.Label>Zone</Form.Label>
                        <Form.Control
                            as="select"
                            value={fields.zone}
                            onChange={handleFieldChange}
                        >
                            {zones.map((zone) => (
                                <option key={zone}>{zone}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="url">
                        <Form.Label>Sandbox URL</Form.Label>
                        <Form.Control
                            type="input"
                            placeholder="Enter the Sandbox URL"
                            value={fields.url}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                </Form.Row>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isChanging={isChanging}
                    disabled={!validateForm()}
                >
                    Add Sandbox To Registry
                </LoaderButton>
            </Form>
        </div>
    )
}
