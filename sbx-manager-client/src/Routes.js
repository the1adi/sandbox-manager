import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import ChangePassword from './containers/ChangePassword'
import Settings from './containers/Settings'
import AddSandbox from './containers/AddSandbox'
import SandboxRegistry from './containers/SandboxRegistry'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <AuthenticatedRoute exact path="/registry/addsandbox">
                <AddSandbox />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/registry">
                <SandboxRegistry />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/settings">
                <Settings />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/settings/password">
                <ChangePassword />
            </AuthenticatedRoute>
            <UnauthenticatedRoute exact path="/login">
                <Login />
            </UnauthenticatedRoute>
            {/* Finally, catch all unmatched routes */}
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
