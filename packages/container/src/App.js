import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import Header from './components/Header';
import Progress from './components/Progress';

const LazyMarketingApp = lazy(() => import('./components/MarketingApp'));
const LazyAuthApp = lazy(() => import('./components/AuthApp'));
const LazyDashboardApp = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory();

export default () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn) {
      history.push('/dashboard');
    }
  }, [signedIn]);

  return (
    <StylesProvider generateClassName={generateClassName}>
      <Router history={history}>
        <div>
          <Header signedIn={signedIn} onSignOut={() => setSignedIn(false)} />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/auth">
                <LazyAuthApp onSignIn={() => setSignedIn(true)} />
              </Route>
              <Route path="/dashboard">
                {!signedIn && <Redirect to="/" />}
                <LazyDashboardApp />
              </Route>
              <Route path="/" component={LazyMarketingApp} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    </StylesProvider>
  );
};
