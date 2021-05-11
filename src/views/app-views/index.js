import React, { lazy, Suspense,useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { UserContext } from '../../provider/UserProvider'


export const AppViews = () => {
  const { currentUser, userDetails } = useContext(UserContext)

  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>

      {!!currentUser ? (
          <Route
            path={`${APP_PREFIX_PATH}/`}
            component={lazy(() => import(`./super-admins`))}
            exact
          />
        ) : (
          <Redirect to="/auth/login" />
        )}

      
        <Route path={`${APP_PREFIX_PATH}/add-admins`} component={lazy(() => import(`./super-admins/user-management`))} />
        <Route path={`${APP_PREFIX_PATH}/add-event`} component={lazy(() => import(`./admins/admins_addevent`))} />

         <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);