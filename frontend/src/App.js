import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import NewsContainer from './components/news/NewsContainer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import DebugAuth from './components/DebugAuth';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './constants/routes';
import './App.css';

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.REGISTER} component={Register} />
          
          {/* Debug Route */}
          <Route path="/debug">
            <DebugAuth />
          </Route>
          
          {/* Protected Routes */}
          <ProtectedRoute exact path={ROUTES.HOME}>
            <NewsContainer category="general" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.GENERAL}>
            <NewsContainer category="general" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.BUSINESS}>
            <NewsContainer category="business" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.TECHNOLOGY}>
            <NewsContainer category="technology" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.SPORTS}>
            <NewsContainer category="sports" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.ENTERTAINMENT}>
            <NewsContainer category="entertainment" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.HEALTH}>
            <NewsContainer category="health" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.SCIENCE}>
            <NewsContainer category="science" />
          </ProtectedRoute>
          
          <ProtectedRoute path={ROUTES.POLITICS}>
            <NewsContainer category="politics" />
          </ProtectedRoute>
          
          {/* Catch all route */}
          <Route path="*">
            <Redirect to={ROUTES.HOME} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

// App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;