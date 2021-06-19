import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import LoaderButton from '../components/LoaderButton'

export default function Settings() {
    return (
        <div className="Settings">
            <LinkContainer to="/settings/password">
                <LoaderButton block size="lg">
                    Change Password
                </LoaderButton>
            </LinkContainer>
            <hr />
        </div>
    )
}
