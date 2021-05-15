import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import EventList from './EventsList'
import AddProduct from './event'
import EditProduct from './watch'

const Ecommerce = (props) => {
  const { match } = props
  return <EventList />
}

export default Ecommerce
