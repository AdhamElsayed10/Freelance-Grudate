import ServiceDetail from '../../components/ServiceDetail'
import { servicesData } from '../../data/servicesData'

export default function Restaurants() {
  return <ServiceDetail service={servicesData['restaurants']} />
}
