import axios from "axios";
import BlogForm from "./components/BlogForm";
import UpdateUserForm from "./components/UpdateUserForm";
import Register from "./components/Register";
import Blog from "./components/Blog";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import NoResult from "./components/NoResult";
import ProtectedRoute from "./components/ProtectedRoute";
import auth from "./auth";
import { checkAuth } from "./helpers/helpers";
import PublicRoute from "./components/PublicRoute";
import { ToastProvider } from "react-toast-notifications";

axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
// axios.defaults.baseURL = "http://192.168.0.153:5000";
axios.defaults.baseURL = "http://localhost:5000";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (checkAuth()) {
      auth.login(() => {
        setIsAuthenticated(Boolean(localStorage.getItem("token")));
      });
    }
  }, []);

  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
      <Router>
        <Switch>
          <Route exact path='/'>
            {isAuthenticated ? <Homepage /> : <Login />}
          </Route>
          <PublicRoute exact path='/login' component={Login} />
          <PublicRoute exact path='/register' component={Register} />
          <PublicRoute exact path='/reset-password' component={ResetPassword} />
          <ProtectedRoute exact path='/home' component={Homepage} />
          <ProtectedRoute
            exact
            path='/create-blog'
            component={() => <BlogForm type='Create' />}
          />
          <ProtectedRoute
            exact
            path='/update-blog/:blogid'
            component={() => <BlogForm type='Update' />}
          />
          <ProtectedRoute exact path='/dashboard' component={Dashboard} />
          <ProtectedRoute
            exact
            path='/my-feed'
            component={() => <Feed type='feed' />}
          />
          <ProtectedRoute exact path='/blog/:blogid' component={Blog} />
          <ProtectedRoute exact path='/user/:userid' component={Profile} />
          <ProtectedRoute
            exact
            path='/search/:query'
            component={() => <Feed type='search' />}
          />
          <ProtectedRoute
            exact
            path='/update-user/:userid'
            component={UpdateUserForm}
          />
          <ProtectedRoute exact path='/no-results' component={NoResult} />
          <Route path='*' component={() => "404 NOT FOUND"} />
        </Switch>
      </Router>
    </ToastProvider>
  );
}
