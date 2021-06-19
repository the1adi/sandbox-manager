import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useFormFields } from '../libs/hooksLib'
import { onError } from '../libs/errorLib'
import DatePicker from 'react-datepicker'
import './Home.css'
import Col from 'react-bootstrap/esm/Col'
import 'react-datepicker/dist/react-datepicker.css'
import { zones, companies } from '../libs/mappingsLib'

export default function Home() {
    // Setting Defauls
    const history = useHistory()
    const [isChanging, setIsChanging] = useState(false)
    const [zone, setZone] = useState(zones[0])
    const [sandboxes, setSandboxes] = useState([''])
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        projectName: '',
        companyName: companies[0],
        sandbox: sandboxes[0],
    })

    useEffect(() => {
        API.get('sandbox', '/sandbox-registry/zone/' + zone).then((sbxRes) => {
            // console.log(sbxRes)
            setSandboxes(sbxRes.Items)
        })
    }, [zone])

    // Choosing a date
    const today = new Date()
    const [endDate, setEndDate] = useState(new Date())

    // Admin or not
    const [isAdmin, setIsAdmin] = useState(false)
    const onSwitchAction = () => {
        setIsAdmin(!isAdmin)
    }

    // Form Validation
    function validateForm() {
        return fields.email.length > 0 && fields.projectName.length > 0
    }

    // Zones and Sandboxes

    async function handleZoneChange(event) {
        console.log('zone:', zone)
        event.preventDefault()
        setZone(event.target.value)
        try {
            const sbxRes = await API.get('sandbox', '/sandbox-registry/all')
            setSandboxes(sbxRes.Items)
            console.log(sandboxes)
        } catch (error) {
            console.log(error)
        }
    }

    // Handle Submit for form
    async function handleSubmit(event) {
        event.preventDefault()

        setIsChanging(true)

        try {
            history.push('/')
        } catch (e) {
            onError(e)
            setIsChanging(false)
        }
    }

    return (
        <div className="Home">
            <div className="lander">
                <h1>Sandbox Request</h1>
                <p className="text-muted">
                    Please submit a sandbox request using the form below
                </p>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="input"
                            placeholder="Enter Your Account Manager email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="companyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                            as="select"
                            value={fields.companyName}
                            onChange={handleFieldChange}
                        >
                            {companies.map((company) => (
                                <option key={company}>{company}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} size="lg" controlId="projectName">
                        <Form.Label>Project Details</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Enter project name and details"
                            value={fields.projectName}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} size="lg" controlId="endDate">
                        <Form.Label>Needed Until</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={today}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="zone">
                        <Form.Label>Zone</Form.Label>
                        <Form.Control
                            as="select"
                            value={zone}
                            onChange={(e) => {
                                handleZoneChange(e)
                            }}
                        >
                            {zones.map((zone) => (
                                <option key={zone}>{zone}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} controlId="sandbox">
                        <Form.Label>Sandbox</Form.Label>
                        <Form.Control
                            as="select"
                            value={fields.sandbox}
                            onChange={handleFieldChange}
                        >
                            {sandboxes.map((sandbox) => (
                                <option key={sandbox}>{sandbox}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Check
                        inline
                        id="isAdmin"
                        label="Assign as Admin"
                        type="switch"
                        checked={isAdmin}
                        onChange={onSwitchAction}
                    />
                </Form.Row>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isChanging={isChanging}
                    disabled={!validateForm()}
                >
                    Create Sandbox Request
                </LoaderButton>
            </Form>
        </div>
    )
}
