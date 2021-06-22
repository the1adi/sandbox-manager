import React, { useState, useEffect } from 'react'
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
import { zones, companies } from '../libs/mappingsLib'

export default function Home() {
    // Setting Defauls
    const _sbxListTemp = {
        0: {
            name: '',
            num: '',
            realm: '',
        },
    }
    const history = useHistory()
    const [isChanging, setIsChanging] = useState(false)
    const [sandboxes, setSandboxes] = useState(_sbxListTemp)
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        projectName: '',
        companyName: companies[0],
        zone: zones[0],
    })
    const [sandbox, setSandbox] = useState(sandboxes[0])

    // Create the list of sandboxes to display
    const parseSandboxesRes = (items) => {
        var list = {}
        items.forEach((element) => {
            list['dev' + element.num + '-' + element.realm] = {
                name: 'dev' + element.num + '-' + element.realm,
                num: element.num,
                realm: element.realm,
            }
        })
        return list
    }

    // Initialize and get sandboxes per zone
    useEffect(() => {
        API.get('sandbox', '/sandbox-registry/zone/' + fields.zone)
            .then((sbxRes) => {
                console.log(sbxRes)
                const list = parseSandboxesRes(sbxRes.Items)
                if (JSON.stringify(list) !== '{}') {
                    console.log('Setting Sandboxes List to:', list)
                    setSandboxes(list)
                    setSandbox(list[Object.keys(list)[0]])
                } else {
                    console.log('Setting Sandboxes List to:', _sbxListTemp)
                    setSandboxes(_sbxListTemp)
                    setSandbox(_sbxListTemp[Object.keys(_sbxListTemp)[0]])
                }
            })
            .catch((error) => {
                console.log(error.response)
            })
    }, [fields.zone])

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
                Zone: fields.zone,
                num: sandbox.num,
                realm: sandbox.realm,
                isAdmin: isAdmin,
            },
        }

        try {
            await API.post('sandbox', '/sandbox-request', params)
            refreshPage()
            alert('Request Submitted!')
            history.push('/')
        } catch (e) {
            onError(e.response.data)
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
                            value={fields.zone}
                            onChange={handleFieldChange}
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
                            value={sandbox.name}
                            onChange={(e) => {
                                // console.log(e)
                                // console.log(
                                //     'TO SET: ',
                                //     sandboxes[e.target.value]
                                // )
                                setSandbox(sandboxes[e.target.value])
                                // console.log('sandbox: ', sandbox)
                            }}
                        >
                            {/* <option></option> */}
                            {Object.keys(sandboxes).map((sandbox) => (
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
                    ischanging={isChanging.toString()}
                    disabled={!validateForm()}
                >
                    Create Sandbox Request
                </LoaderButton>
            </Form>
        </div>
    )
}
