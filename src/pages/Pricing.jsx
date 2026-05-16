import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import PricingCard from '../components/PricingCard'

export default function Pricing() {
  const { t, ta } = useLanguage()

  const plans = [
  { 
    name: t('pricing', 'freeName'), 
    price: '0', 
    period: t('pricing', 'monthly'), 
    description: t('pricing', 'freeDesc'), 
    features: ta('pricing', 'freeFeatures')
  },
  { 
    name: t('pricing', 'premiumName'), 
    price: '99', 
    period: t('pricing', 'monthly'), 
    description: t('pricing', 'premiumDesc'), 
    features: ta('pricing', 'premiumFeatures')
  },
  { 
    name: t('pricing', 'eliteName'), 
    price: '199', 
    period: t('pricing', 'monthly'), 
    description: t('pricing', 'eliteDesc'), 
    features: ta('pricing', 'eliteFeatures')
  },
]

  return (
    <>
      <Helmet>
        <title>{t('pricing', 'title')}</title>
        <meta name="description" content={t('pricing', 'description')} />
      </Helmet>
      <section className="pt-32 pb-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold font-bold text-sm tracking-wider uppercase mb-2 block">{t('pricing', 'sectionLabel')}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">{t('pricing', 'heading')}</h1>
            <p className="text-dark/60 max-w-2xl mx-auto">{t('pricing', 'paragraph')}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan, i) => (
              <PricingCard key={i} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}