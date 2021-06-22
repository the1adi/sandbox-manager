import React, { useState } from 'react'
import { Auth } from 'aws-amplify'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useAppContext } from '../libs/contextLib'
import { useFormFields } from '../libs/hooksLib'
import { onError } from '../libs/errorLib'
import './ChangePassword.css'

export default function ChangePassword() {
    const history = useHistory()
    const { userHasAuthenticated } = useAppContext()
    const [isChanging, setIsChanging] = useState(false)
    const [fields, handleFieldChange] = useFormFields({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    })

    function validateForm() {
        return (
            fields.oldPassword.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        )
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setIsChanging(true)

        try {
            const currentUser = await Auth.currentAuthenticatedUser()
            console.log(currentUser)
            await Auth.changePassword(
                currentUser,
                fields.oldPassword,
                fields.password
            )
            userHasAuthenticated(true)
            history.push('/settings')
        } catch (e) {
            onError(e)
            setIsChanging(false)
        }
    }

    return (
        <div className="ChangePassword">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="oldPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        autoFocus
                        type="password"
                        value={fields.oldPassword}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        autoFocus
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.confirmPassword}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    ischanging={isChanging.toString()}
                    disabled={!validateForm()}
                >
                    Change Password
                </LoaderButton>
            </Form>
        </div>
    )
}
