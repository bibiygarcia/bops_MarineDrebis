import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import Landing from '../pages/Landing';
import LandingOrganization from '../pages/LandingOrganization';
import SignInOrganization from '../pages/SignInOrganization';
import SignUpOrganization from '../pages/SignUpOrganization';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import ListReported from '../pages/ListReported';
import ListClaimed from '../pages/ListClaimed';
import ListStored from '../pages/ListStored';
import ListDisposed from '../pages/ListDisposed';
import ListAnalyze from '../pages/ListAnalyze';
import Detail from '../pages/Detail';
import ReportDebris from '../pages/ReportDebris';
import NotAuthorized from '../pages/NotAuthorized';
import LoadingSpinner from '../components/LoadingSpinner';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/landing" element={<Landing />} />
          <Route exact path="/organization/landing" element={<LandingOrganization />} />
          <Route path="/organization/signin" element={<SignInOrganization />} />
          <Route path="/organization/signup" element={<SignUpOrganization />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/report" element={<ReportDebris />} />
          <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/profile/:_id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit/:_id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/reported" element={<ProtectedRoute><ListReported /></ProtectedRoute>} />
          <Route path="/claimed" element={<ProtectedRoute><ListClaimed /></ProtectedRoute>} />
          <Route path="/stored" element={<ProtectedRoute><ListStored /></ProtectedRoute>} />
          <Route path="/distributed" element={<ProtectedRoute><ListDisposed /></ProtectedRoute>} />
          <Route path="/analysis" element={<AdminProtectedRoute ready={ready}><ListAnalyze /></AdminProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportDebris /></ProtectedRoute>} />
          <Route path="/detail/:_id" element={<ProtectedRoute><Detail /></ProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
