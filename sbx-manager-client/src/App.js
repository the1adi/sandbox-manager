import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { AppContext } from './libs/contextLib'
import { Auth } from 'aws-amplify'
import './App.css'
import Routes from './Routes'
import { onError } from './libs/errorLib'
import { useHistory } from 'react-router-dom'

function App() {
    const history = useHistory()
    const [isAuthenticating, setIsAuthenticating] = useState(true)
    const [isAuthenticated, userHasAuthenticated] = useState(false)

    useEffect(() => {
        onLoad()
    }, [])

    async function onLoad() {
        try {
            await Auth.currentSession()
            userHasAuthenticated(true)
        } catch (e) {
            if (e !== 'No current user') {
                console.log(e.response.data)
                onError(e)
            }
        }

        setIsAuthenticating(false)
    }

    async function handleLogout() {
        await Auth.signOut()

        userHasAuthenticated(false)

        history.push('/login')
    }

    return (
        !isAuthenticating && (
            <div className="App container py-3">
                <Navbar
                    collapseOnSelect
                    bg="light"
                    expand="md"
                    className="mb-3"
                >
                    <LinkContainer to="/">
                        <Navbar.Brand className="font-weight-bold text-muted">
                            <img
                                alt=""
                                src="/batman-logo.png"
                                width="60"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            SFCC Sandbox Manager
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav activeKey={window.location.pathname}>
                            {isAuthenticated ? (
                                <>
                                    <LinkContainer to="/requests">
                                        <Nav.Link>Requests</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/settings">
                                        <Nav.Link>Settings</Nav.Link>
                                    </LinkContainer>
                                    <Nav.Link onClick={handleLogout}>
                                        Logout
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to="/signup">
                                        <Nav.Link disabled="true">
                                            Signup
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Login</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <AppContext.Provider
                    value={{ isAuthenticated, userHasAuthenticated }}
                >
                    <Routes />
                </AppContext.Provider>
            </div>
        )
    )
}

export default App
