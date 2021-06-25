import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import ChangePassword from './containers/ChangePassword'
import Settings from './containers/Settings'
import AddSandbox from './containers/AddSandbox'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'
import RequestNewSandbox from './containers/RequestNewSandbox'
import RequestSandbox from './containers/RequestSandbox'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/sandboxrequest/:zone/:num/:realm">
                <RequestSandbox />
            </Route>
            <Route exact path="/newsandboxrequest">
                <RequestNewSandbox />
            </Route>
            <AuthenticatedRoute exact path="/addsandbox">
                <AddSandbox />
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
