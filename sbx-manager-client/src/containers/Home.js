import React, { useState } from 'react'
import { Auth } from 'aws-amplify'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useAppContext } from '../libs/contextLib'
import { useFormFields } from '../libs/hooksLib'
import { onError } from '../libs/errorLib'
import DatePicker from 'react-datepicker'
import './Home.css'
import Col from 'react-bootstrap/esm/Col'
import 'react-datepicker/dist/react-datepicker.css'

export default function Home() {
    const history = useHistory()
    const { userHasAuthenticated } = useAppContext()
    const [isChanging, setIsChanging] = useState(false)
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        projectName: '',
    })
    const [endDate, setEndDate] = useState(new Date())

    function validateForm() {
        return fields.email.length > 0 && fields.projectName.length > 0
    }

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
                        <Form.Control as="select">
                            <option>L'Oreal</option>
                            <option>Sapient</option>
                            <option>Astound</option>
                            <option>OSF</option>
                            <option>Salesforce</option>
                            <option>Other</option>
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
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Check
                    inline
                    label="Assign as Admin"
                    name="admin"
                    type="radio"
                />
                <Form.Check
                    inline
                    label="Assign as User"
                    name="admin"
                    type="radio"
                />
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
