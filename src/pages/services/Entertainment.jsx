import ServiceDetail from '../../components/ServiceDetail'
import { servicesData } from '../../data/servicesData'

export default function Entertainment() {
  return <ServiceDetail service={servicesData['entertainment']} />
}
