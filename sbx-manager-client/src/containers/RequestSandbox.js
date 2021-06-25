import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from 'aws-amplify'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useFormFields, refreshPage } from '../libs/hooksLib'
import { onError } from '../libs/errorLib'
import DatePicker from 'react-datepicker'
import './Home.css'
import Col from 'react-bootstrap/esm/Col'
import 'react-datepicker/dist/react-datepicker.css'
import { companies } from '../libs/mappingsLib'
import './RequestSandbox.css'

export default function RequestSandbox() {
    const history = useHistory()
    let { zone, num, realm } = useParams()
    const placeholder = 'dev' + num + '-' + realm
    // console.log('Params:', num, realm)
    const [isChanging, setIsChanging] = useState(false)
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        projectName: '',
        companyName: companies[0],
    })

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

    // Handle Submit for form
    async function handleSubmit(event) {
        event.preventDefault()

        setIsChanging(true)

        const params = {
            body: {
                details: {
                    projectName: fields.projectName,
                    company: fields.companyName,
                    expirationDate: endDate,
                },
                email: fields.email,
                zone: zone,
                num: num,
                realm: realm,
                isAdmin: isAdmin,
            },
        }

        try {
            await API.post('sandbox', '/sandbox-request', params)
            // refreshPage()
            alert('Request Submitted!')
            history.push('/')
        } catch (e) {
            onError(e.response.data)
            setIsChanging(false)
        }
    }

    return (
        <div className="RequestSandbox">
            <div className="lander">
                <h1>Sandbox Request</h1>
                <p className="text-muted">
                    Request access to the sandbox below
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
                        <Form.Label>Needed Until</Form.Label> <br></br>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={today}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="sandbox">
                        <Form.Control
                            type="text"
                            placeholder={placeholder}
                            readOnly
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Check
                        inline
                        id="isAdmin"
                        label="Request Admin Permissions"
                        type="switch"
                        checked={isAdmin}
                        onChange={onSwitchAction}
                    />
                </Form.Row>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    ischanging={isChanging.toString()}
                    disabled={!validateForm()}
                >
                    Create Sandbox Request
                </LoaderButton>
            </Form>
        </div>
    )
}
