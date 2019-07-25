import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Main from './pages/Main';
import Box from './pages/Box';
import Boxes from './pages/Boxes';

const Routes = () =>(

    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/box/:id" component={Box} />
            <Route path="/list" component={Boxes} />
        </Switch>
    </BrowserRouter>
)

export default Routes;