import ServiceDetail from '../../components/ServiceDetail'
import { servicesData } from '../../data/servicesData'

export default function Courses() {
  return <ServiceDetail service={servicesData['courses']} />
}
