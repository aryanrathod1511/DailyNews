import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import News from './components/News';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

// Main App Component
const AppContent = () => {
  // eslint-disable-next-line no-unused-vars
  const [progress, setProgress] = useState(0);

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          {/* Public Routes */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          
          {/* Protected Routes */}
          <ProtectedRoute exact path="/">
            <News key="general" pageSize={20} category="general" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/general">
            <News key="general" pageSize={20} category="general" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/business">
            <News key="business" pageSize={20} category="business" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/technology">
            <News key="technology" pageSize={20} category="technology" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/sports">
            <News key="sports" pageSize={20} category="sports" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/entertainment">
            <News key="entertainment" pageSize={20} category="entertainment" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/health">
            <News key="health" pageSize={20} category="health" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/science">
            <News key="science" pageSize={20} category="science" setProgress={setProgress} />
          </ProtectedRoute>
          
          <ProtectedRoute path="/politics">
            <News key="politics" pageSize={20} category="politics" setProgress={setProgress} />
          </ProtectedRoute>
          
          {/* Catch all route */}
          <Route path="*">
            <Redirect to="/" />
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