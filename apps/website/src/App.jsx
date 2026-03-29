import './App.css'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { LanguageShowcase } from './components/LanguageShowcase'
import { ExamplesGrid } from './components/ExamplesGrid'

export default function App() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <LanguageShowcase />
      <ExamplesGrid />
    </div>
  )
}
