import { useState, useEffect } from 'react'
import ServiceDetail from '../../components/ServiceDetail'
import { servicesData } from '../../data/servicesData'
import { getAllEntertainmentVenues } from '../../data/db'

export default function Entertainment() {
  const [venues, setVenues] = useState([])

  useEffect(() => {
    setVenues(getAllEntertainmentVenues())
  }, [])

  return <ServiceDetail service={servicesData['entertainment']} venues={venues} />
}
