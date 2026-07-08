const featureList = [
  {
    title: 'Trade Intelligence',
    text: 'Track positions, execution history, and market movements from one secure dashboard.',
  },
  {
    title: 'Wallet Connectivity',
    text: 'Connect exchange and wallet workflows with streamlined data and reporting support.',
  },
  {
    title: 'Proprietary Algorithms',
    text: 'Use smart analysis and automation to sharpen decision-making for every market cycle.',
  },
  {
    title: 'Live Crypto News',
    text: 'Stay up to date with the latest developments that affect portfolios, strategy, and compliance.',
  },
  {
    title: 'Portfolio Overview',
    text: 'See allocations, risk exposure, and performance benchmarks in a single view.',
  },
  {
    title: 'Advanced Charts',
    text: 'Analyse patterns and momentum with clear indicators designed for professionals.',
  },
]

export default function FeatureCards() {
  return (
    <div className="row align-self-center gy-4">
      {featureList.map((item, index) => (
        <div className="col-md-6" key={item.title} data-aos="fade-up" data-aos-delay={(index + 2) * 100}>
          <div className="content-card p-4 h-100">
            <div className="feature-box d-flex align-items-center">
              <i className="bi bi-check2-circle"></i>
              <h3>{item.title}</h3>
            </div>
            <p className="mt-3 mb-0 text-muted">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
