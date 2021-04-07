import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <Route path={`${APP_PREFIX_PATH}/superadmins`} component={lazy(() => import(`./super-admins`))} />
        <Route path={`${APP_PREFIX_PATH}/add-admins`} component={lazy(() => import(`./super-admins/add-admins`))} />

         <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/superadmins`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);