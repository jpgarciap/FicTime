
import React, { useEffect, useContext, useState } from 'react';
import * as ROUTES from '../../constants/routes';
import { AuthContext } from '../../components/Firebase/context';
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {

    const [isAdmin, setIsAdmin] = useState(null);

    const { currentUser } = useContext(AuthContext);
  
    useEffect(() => {
      if (currentUser) {
        currentUser.getIdTokenResult()
        .then((idTokenResult) => {
          if (!!idTokenResult.claims.admin) {
            setIsAdmin(true);
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    }, [currentUser]);

    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAdmin ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: ROUTES.LANDING,
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }