import { useEffect } from 'react'
import '../political-page.css'
import PageBanner from '../components/PageBanner'

function useScrollReveal() {
  useEffect(() => {
    const revealOnScroll = () => {
      document
        .querySelectorAll('.pol-strategy-page .reveal, .pol-strategy-page .reveal-zoom, .pol-strategy-page .reveal-left, .pol-strategy-page .reveal-right, .pol-strategy-page .card-reveal, .pol-strategy-page .text-reveal, .pol-strategy-page .about-card, .pol-strategy-page .specialty-card, .pol-strategy-page .service-card, .pol-strategy-page .case-block, .pol-strategy-page .strategy-item, .pol-strategy-page .political-hero-feature-card')
        .forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight - 120) {
            el.classList.add('active')
          }
        })
    }
    window.addEventListener('scroll', revealOnScroll)
    revealOnScroll()
    return () => window.removeEventListener('scroll', revealOnScroll)
  }, [])
}

export default function PoliticalPage() {
  useScrollReveal()

  return (
    <main className="pol-strategy-page">
      <PageBanner
        title="Political"
        breadcrumbs={[{ label: 'Political' }]}
        backgroundImage="/political-hero.png"
        mobileBackgroundImage="/political-hero-mobile.png"
        bannerClass="political-banner"
      />

      <div className="marquee-wrapper">
        <div className="marquee-track">
          <div className="marquee-item">Empowering Political Leaders Digitally.</div>
          <div className="marquee-item">Strategic Campaigns. Strong Public Presence.</div>
          <div className="marquee-item">From Booth Level to National Influence.</div>
          <div className="marquee-item">Empowering Political Leaders Digitally.</div>
          <div className="marquee-item">Strategic Campaigns. Strong Public Presence.</div>
          <div className="marquee-item">From Booth Level to National Influence.</div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-content reveal-left">
          <span className="hero-kicker">Political Strategy</span>
          <h1>राजकीय विजयासाठी स्मार्ट स्ट्रॅटेजी</h1>
          <p>
            लोकसभा, महापालिका ते जिल्हा परिषद – तुमच्या राजकीय विकासासाठी
            विश्वासार्ह डिजिटल आणि स्ट्रॅटेजी भागीदार.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">सलाह सत्र बुक करा</a>
            <a href="#contact" className="btn-secondary">संपर्क करा</a>
          </div>
        </div>
        <div className="hero-visual reveal-right">
          <div className="hero-visual-card hero-info-card">
            <div className="hero-visual-badge">Strategy Focus</div>
            <h3>रणनीती, तंत्रज्ञान आणि नेतृत्वाचा शक्तिशाली संगम</h3>
            <ul className="hero-feature-list">
              <li>डेटा-आधारित प्रचार योजना</li>
              <li>डिजिटल कंटेंट आणि सोशल स्ट्रॅटेजी</li>
              <li>भू-स्तरीय संवाद आणि मतदार कनेक्ट</li>
              <li>प्रभावी नेतृत्व आणि संघटनात्मक समर्थन</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-wrapper">
          <div className="about-left reveal">
            <span className="about-label text-reveal">About PLUTUSS</span>
            <h2 className="text-reveal">
              रणनीती, तंत्रज्ञान आणि नेतृत्वाचा <br />
              शक्तिशाली संगम
            </h2>
            <p className="about-intro text-reveal">
              PLUTUSS Digital ही भारतातील अग्रगण्य राजकीय डिजिटल आणि स्ट्रॅटेजी
              एजन्सी आहे. आम्ही लोकसभा, महापालिका, जिल्हा परिषद तसेच इतर निवडणुका
              यशस्वी करण्यासाठी आधुनिक डिजिटल साधने, क्रिएटिव्ह स्ट्रॅटेजी आणि
              विश्लेषणात्मक अंतर्दृष्टी वापरतो.
            </p>
            <p className="text-reveal">
              आमची कथा राजकीय अनुभव, तंत्रज्ञान आणि सर्जनशीलतेच्या संगमाने तयार
              झाली आहे, ज्यामुळे प्रत्येक उमेदवार आणि पक्षासाठी परिणामकारक अभियान
              राबवता येते.
            </p>
          </div>
          <div className="about-right">
            <div className="about-card vision-card reveal-zoom card-reveal">
              <h3>व्हिजन (Our Vision)</h3>
              <p className="quote">
                “राजकीय नेतृत्वाला डिजिटल सामर्थ्य देणे आणि प्रत्येक उमेदवाराचा
                संदेश जनतेपर्यंत प्रभावीपणे पोहोचवणे.”
              </p>
              <p>
                स्मार्ट स्ट्रॅटेजी + क्रिएटिव्ह डिजिटल हे राजकीय यशाची गुरुकिल्ली
                आहे.
              </p>
            </div>
            <div className="about-card mission-card reveal-zoom card-reveal">
              <h3>मिशन (Our Mission)</h3>
              <ul>
                <li>
                  सर्जनशील रणनीती आणि डिजिटल माध्यमांचा प्रभावी वापर करून राजकीय
                  यश मिळवणे.
                </li>
                <li>डेटा-चालित आणि परिणामकारक अभियान राबवणे.</li>
                <li>मतदारांशी थेट संवाद साधणे व विश्वास निर्माण करणे.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-header">
          <h2 className="text-reveal">अनुभव आणि रणनीती</h2>
          <div className="experience-tagline">
            <p className="text-reveal">
              अनुभव, क्रिएटिव्हिटी आणि स्ट्रॅटेजी – PLUTUSS सोबत तुमचे यश
              सुनिश्चित!
            </p>
          </div>
        </div>
        <div className="experience-wrapper">
          <div className="experience-left reveal-left">
            <h3>अनुभव</h3>
            <p>
              PLUTUSS Digital ला २०+ वर्षांचा मीडिया आणि राजकीय स्ट्रॅटेजी अनुभव
              आहे. आमच्या टीमने लोकसभा, महापालिका, जिल्हा परिषद तसेच इतर अनेक
              निवडणुकांमध्ये यशस्वी मोहिमा राबवल्या आहेत.
            </p>
            <h4>सर्व प्रकारच्या निवडणुकांमध्ये काम:</h4>
            <ul className="election-list">
              <li>लोकसभा निवडणूक</li>
              <li>महापालिका / नगरसेवा निवडणूक</li>
              <li>जिल्हा परिषद / पंचायत निवडणूक</li>
              <li>बूथ-स्तरीय रणनीती आणि जनतेपर्यंत प्रभावी पोहोच</li>
            </ul>
          </div>
          <div className="experience-right reveal-right">
            <div className="specialty-card card-reveal">
              <h4>डेटा-चालित रणनीती</h4>
              <p>प्रत्येक निर्णय आणि मोहिमेला डेटा-आधारित दृष्टिकोन</p>
            </div>
            <div className="specialty-card reveal-zoom card-reveal">
              <h4>क्रिएटिव्ह डिजिटल कंटेंट</h4>
              <p>व्हिडिओ, ग्राफिक्स, रील्स, सोशल मीडिया</p>
            </div>
            <div className="specialty-card reveal-zoom card-reveal">
              <h4>राजकीय नेटवर्क व संपर्क</h4>
              <p>कार्यकर्ते, मतदार आणि नेत्यांशी मजबूत संबंध</p>
            </div>
            <div className="specialty-card reveal-zoom card-reveal">
              <h4>प्रभावी नेतृत्व व टीमवर्क</h4>
              <p>अनुभवसंपन्न टीमकडून संपूर्ण कॅम्पेन अंमलबजावणी</p>
            </div>
          </div>
        </div>
      </section>

      <section className="case-study-section">
        <div className="case-study-wrapper">
          <div className="case-study-header">
            <span className="case-label text-reveal">Case Study 01</span>
            <h2 className="text-reveal">प्रभाग क्रमांक २० | महानगरपालिका निवडणूक</h2>
            <p className="party-badge text-reveal">पक्ष : राष्ट्रवादी काँग्रेस पक्ष (NCP)</p>
          </div>
          <div className="case-block reveal card-reveal">
            <h3>आव्हानांचे विश्लेषण – आमची भूमिका</h3>
            <p>
              प्रभाग क्रमांक २० मधील निवडणूक ही अत्यंत तुल्यबळ आणि चुरशीची आहे,
              याची आम्ही सुरुवातीपासूनच नोंद घेतली. विरोधी उमेदवारांकडून सक्षम आणि
              संघटित प्रचार सुरू असल्याचे आम्ही लक्षात घेतले असून त्यांच्या
              रणनीतीचा सखोल अभ्यास केला.
            </p>
            <p>
              प्रभागातील स्थानिक प्रश्न, सामाजिक रचना, मतदारांच्या अपेक्षा आणि
              विरोधी प्रचारातील मुद्दे यांचे आम्ही बारकाईने विश्लेषण केले.
              प्रत्येक घटक, प्रत्येक बूथ आणि प्रत्येक वॉर्डनिहाय परिस्थितीचा
              स्वतंत्र आढावा घेतला.
            </p>
          </div>
          <div className="case-block reveal card-reveal">
            <h3>आमची रणनिती</h3>
            <ul className="strategy-list">
              <li>
                <div className="strategy-item">
                  <div className="strategy-content">
                    <h4>१. तुल्यबळ लढतीसाठी सक्षम तयारी</h4>
                    <p>
                      बूथ-स्तरावर मजबूत संघटन उभारून कार्यकर्त्यांची जबाबदारी
                      निश्चित केली. घरभेट, लघु सभा आणि संवाद उपक्रम राबवले.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="strategy-item">
                  <div className="strategy-content">
                    <h4>२. विरोधी प्रोफाइल अभ्यास</h4>
                    <p>
                      विरोधी उमेदवारांचे बलस्थान, कमकुवत बाजू आणि प्रचार पद्धतींचा
                      अभ्यास करून सकारात्मक व प्रभावी प्रत्युत्तराची रणनीती आखली.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="strategy-item">
                  <div className="strategy-content">
                    <h4>३. विकासाधारित संवाद मोहीम</h4>
                    <p>
                      “कामावर आधारित विश्वास” या तत्त्वावर प्रचार केंद्रित केला.
                      पूर्ण केलेली कामे, सुरू असलेले प्रकल्प आणि आगामी विकास
                      आराखडा स्पष्टपणे मांडला.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="strategy-item">
                  <div className="strategy-content">
                    <h4>४. डिजिटल + ग्राउंड समन्वय</h4>
                    <p>
                      सोशल मीडिया, व्हॉट्सअ‍ॅप नेटवर्क, व्हिडिओ संदेश आणि
                      प्रत्यक्ष भेटी यांचा समन्वित वापर करून सातत्यपूर्ण आणि
                      प्रभावी संवाद साधला.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="strategy-item">
                  <div className="strategy-content">
                    <h4>५. तात्काळ समस्या निराकरण</h4>
                    <p>
                      प्रभागातील तक्रारींवर तत्परतेने कार्यवाही करून आश्वासनाऐवजी
                      कृतीतून विश्वास निर्माण केला.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="case-block reveal-zoom case-highlight">
            <h3>आमचा निर्धार</h3>
            <p>
              तुल्यबळ लढतीतही नियोजनबद्ध, अभ्यासपूर्ण आणि विकासाभिमुख रणनितीच्या
              जोरावर आम्ही प्रभाग क्रमांक २० मध्ये विश्वासाचे नेतृत्व उभे केले
              आहे.
            </p>
            <div className="case-closing">
              <strong>
                प्राधान्य जनसेवेला… <br />
                प्रभागाच्या सर्वांगीण विकासाला!
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="case-study-section">
        <div className="case-study-wrapper">
          <div className="case-study-header">
            <span className="case-label text-reveal">Case Study 02</span>
            <h2 className="text-reveal">पश्चिम महाराष्ट्र | युवा नेतृत्व प्रतिमा पुनर्स्थापना मोहीम</h2>
            <p className="party-badge text-reveal">पक्ष : शिवसेना</p>
            <p className="confidential-note text-reveal">
              * उमेदवाराची ओळख गोपनीय ठेवण्यात आलेली आहे.

            </p>
          </div>
          <div className="case-block reveal-zoom">
            <h3>आव्हानांचे स्वरूप</h3>
            <div className="challenge-item">
              <h4>१. “वंशपरंपरागत राजकारण” अशी प्रतिमा</h4>
              <p>
                विरोधकांकडून उमेदवारावर “वंशपरंपरागत राजकारण” असा शिक्का
                उमटवण्याचा सातत्याने प्रयत्न केला जात होता. नेतृत्व केवळ कुटुंबीय
                पार्श्वभूमीशी जोडून दाखवले जात होते.
              </p>
              <p>
                प्रत्यक्षात उमेदवाराने स्वतःच्या ग्राउंडवर्क, युवक उपक्रम आणि
                स्थानिक कामांच्या आधारे स्वतंत्र ओळख निर्माण केली होती. ही
                वस्तुस्थिती प्रभावीपणे जनतेसमोर मांडणे हे आमच्यासमोरील मुख्य
                आव्हान होते.
              </p>
            </div>
            <div className="challenge-item">
              <h4>२. संसाधनसमृद्ध आणि संघटित स्पर्धा</h4>
              <p>
                विरोधी पक्षांकडून आक्रमक आणि साधनसंपन्न प्रचार सुरू होता. स्थानिक
                नेटवर्क आणि संघटनात्मक ताकदीमुळे निवडणूक अत्यंत तुल्यबळ होती.
              </p>
            </div>
            <div className="challenge-item">
              <h4>३. युवा नेतृत्वाची प्रतिमा दृढ करणे</h4>
              <p>
                कार्यरत युवा नेता म्हणून ओळख असली तरी ती व्यापक जनसमर्थनात
                रूपांतरित करणे आवश्यक होते. “राजकारण्याचा मुलगा” या ओळखीपलीकडे
                जाऊन “स्वतःच्या कार्यावर उभा असलेला तरुण नेता” अशी प्रतिमा निर्माण
                करणे हे आमचे उद्दिष्ट होते.
              </p>
            </div>
          </div>
          <div className="case-block reveal-zoom">
            <h3>आमचा दृष्टिकोन</h3>
            <p>
              संवाद, प्रतिमा व्यवस्थापन आणि ग्राउंड कनेक्ट या तीन स्तरांवर
              नियोजनबद्ध रणनीती आखण्यात आली.
            </p>
            <div className="case-quote">“वंश नव्हे, कार्य हीच ओळख.”</div>
          </div>
          <div className="case-block reveal-zoom">
            <h3>आमची रणनीती (Strategic Approach)</h3>
            <ul className="strategy-list">
              <li>
                <h4>१. “नेपोटिझम नव्हे, ग्राउंडवर्क” — मुख्य संदेश</h4>
                <p>
                  प्रतिमा “कौटुंबिक ओळख” या चौकटीतून बाहेर काढून “स्वतःच्या कामावर
                  उभा असलेला तरुण नेता” अशी पुनर्स्थापित करण्यात आली.
                </p>
                <p>
                  स्थानिक कामे, युवक उपक्रम, सामाजिक सहभाग आणि संकटकाळातील
                  मदतकार्य यावर विशेष भर देण्यात आला.
                </p>
              </li>
              <li>
                <h4>२. डिजिटल डॉक्युमेंटरी कॅम्पेन</h4>
                <p>
                  <strong>उद्दिष्ट:</strong> प्रत्यक्ष काम आणि लोकांचा विश्वास
                  दृश्य माध्यमातून सिद्ध करणे.
                </p>
                <p>
                  ८–१२ मिनिटांची मुख्य डॉक्युमेंटरी फिल्म, सोशल मीडिया कट्स, रील्स
                  आणि शॉर्ट्स मालिका तयार करण्यात आली.
                </p>
                <p>
                  ग्राउंड व्हिज्युअल्स, नागरिकांच्या मुलाखती, आणि “Before–After”
                  स्वरूपातील बदल यांचा समावेश करण्यात आला.
                </p>
                <p>
                  मोहीम प्रचारात्मक नसून माहितीपट शैलीत सादर करण्यात आली —
                  विश्वासार्हता हेच केंद्रबिंदू ठेवून.
                </p>
              </li>
              <li>
                <h4>३. लोकांच्या आवाजातून प्रतिमा उभारणी</h4>
                <p>
                  कृत्रिम प्रचाराऐवजी नैसर्गिक संवादावर भर देण्यात आला. स्थानिक
                  नागरिक, कुटुंबे आणि लाभार्थी यांच्या अनुभवांमधून विश्वास निर्माण
                  करण्यात आला.
                </p>
              </li>
              <li>
                <h4>४. तुलनात्मक संदेश (Subtle Contrast Strategy)</h4>
                <p>विरोधकांवर थेट टीका न करता सूचक तुलना मांडण्यात आली:</p>
                <ul className="sub-list">
                  <li>काम विरुद्ध केवळ आश्वासन</li>
                  <li>प्रत्यक्ष उपस्थिती विरुद्ध राजकीय ओळख</li>
                  <li>युवक नेतृत्व विरुद्ध पारंपरिक राजकारण</li>
                </ul>
                <p>संदेश सकारात्मक, अभ्यासपूर्ण आणि विकासाधारित ठेवण्यात आला.</p>
              </li>
            </ul>
          </div>
          <div className="case-block reveal-zoom case-highlight">
            <h3>मुख्य पोझिशनिंग</h3>
            <div className="case-closing">
              <strong>
                “वंश नव्हे, कार्य ही ओळख.” <br />
                उपलब्ध, जबाबदार आणि कार्यावर उभे असलेले युवा नेतृत्व.
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-header">
          <h2 className="text-reveal">संपर्क करा</h2>
          <p className="text-reveal">तुमच्या पुढील विजयासाठी आजच संपर्क साधा</p>
        </div>
        <div className="contact-wrapper">
          <div className="form-container reveal-left">
            <h2>Contact Us</h2>
            <form
              id="contactForm"
              action="https://api.web3forms.com/submit"
              method="POST"
            >
              <input
                type="hidden"
                name="access_key"
                value="1cb6c821-be49-4cea-bf07-aeb4863aa8a4"
              />
              <input
                type="hidden"
                name="subject"
                value="New Contact Form Submission - PLUTUSS Website"
              />
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" rows={4} placeholder="Your Message" required />
              <button type="submit">Send Message</button>
            </form>
          </div>
          <div className="contact-info-box reveal-right">
            <h3>कार्यालय पत्ता</h3>
            <p>
              PLUTUSS Digital Strategy Office<br />
              पुणे, महाराष्ट्र, भारत
            </p>
            <div className="contact-social">
              <a href="https://www.facebook.com/plutuss.digital" target="_blank" rel="noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/plutussdigital/" target="_blank" rel="noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@PlutussDigital" target="_blank" rel="noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
            <div className="map-container">
              <iframe
                src="https://maps.google.com/maps?q=Plutuss%20Digital%20Wakad%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
                title="Plutuss Digital Office Map"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
