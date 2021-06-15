import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Constructor } from "./constructor/Constructor";
import { Menu } from "./menu/Menu";
import Authorisation from "./authorisation/Authorisation";
import { CSSTransition } from "react-transition-group";
import Workout from "./workout/Workout";
import Nutrition from "./nutrition/Nutrition";
import Statistics from "./statistics/Statistics";

const routes = [
  { path: "/", Component: Menu },
  { path: "/constructor", Component: Constructor },
  { path: "/nutrition", Component: Nutrition },
  { path: "/workout", Component: Workout },
  { path: "/archive", Component: Statistics },
];

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <div>
        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={300}
                classNames={
                  path === "/constructor" ? "page_main" : "page_main_workout"
                }
                unmountOnExit
              >
                <div
                  className={
                    path === "/constructor" ? "page_main" : "page_main_workout"
                  }
                >
                  <Component />
                </div>
              </CSSTransition>
            )}
          </Route>
        ))}
        <Redirect to="/" />
      </div>
    );
  }

  return (
    <Switch>
      <Route exact path="/resetpassword/:id/:token">
        <Authorisation />
      </Route>
      <Route path="/">
        <Authorisation />
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};
