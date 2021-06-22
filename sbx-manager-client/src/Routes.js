import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import ChangePassword from './containers/ChangePassword'
import Settings from './containers/Settings'
import AddSandbox from './containers/AddSandbox'
import SandboxRegistry from './containers/SandboxRegistry'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/registry/addsandbox">
                <AddSandbox />
            </Route>
            <Route exact path="/registry">
                <SandboxRegistry />
            </Route>
            <Route exact path="/settings">
                <Settings />
            </Route>
            <Route exact path="/settings/password">
                <ChangePassword />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/resetpassword">
                <ChangePassword />
            </Route>
            {/* Finally, catch all unmatched routes */}
            <Route>
                <NotFound />
            </Route>
        </Switch>
    )
}
