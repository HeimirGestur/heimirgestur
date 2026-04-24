import { Layout } from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="font-sans text-xl text-foreground mb-2 text-left">
            Heimir Gestur Valdimarsson
          </h1>
          <p className="font-sans text-sm text-muted-foreground mb-8 text-left">
            Cinematographer | Photographer | Musician
          </p>

          <section className="text-left mb-12">
            <h2 className="font-sans text-base text-foreground mb-3">Professional Profile</h2>
            <div className="space-y-5">
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                I am an Icelandic cinematographer and photographer, my work is deeply rooted in the traditions of classical cinema. My visual language is shaped by education in the craft as I completed both my Bachelor's and Master's degrees at the National Film School in Łódź.
              </p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                This foundation has instilled in me a disciplined approach to the image, particularly through my extensive work with analog film. My aesthetic is defined by technical precision and atmospheric storytelling, applying the weight of classical cinematic traditions to a modern context.
              </p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                My portfolio as a Director of Photography includes award-winning short films and music videos recognized by the Reykjavík International Film Festival and the Icelandic Music Awards. This visual work is linked to my background as a musician; having performed with various bands and composed scores for brands such as ACNE and Nordiska Galleriet, I bring a rhythmic, melodic sensibility to the projects I work on.
              </p>
            </div>
          </section>

          <div className="space-y-10 text-left mb-12">
            <section>
              <h2 className="font-sans text-base text-foreground mb-3">Education</h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                The National Film School in Łódź: Master of Arts and Bachelor of Arts in Cinematography.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-base text-foreground mb-3">Selected Filmography</h2>

              <h3 className="font-sans text-sm text-foreground mt-4 mb-2">Director / Director of Photography</h3>
              <ul className="space-y-1.5 font-sans text-sm text-muted-foreground leading-relaxed">
                <li>Passage (2026) | Camera: Arri Alexa LF | Lenses: Scorpio.</li>
                <li>PLEŚŃ (2024) | Camera: ARRI Alexa Mini | Lenses: Zeiss Super Speeds.</li>
                <li>RYBA (2017) | Camera: MOVICAM SL 35mm | Lenses: Zeiss Super Speeds.</li>
                <li>KJÖT (2013) | Camera: ARRI 435 35mm | Lenses: Zeiss T1 | Winner: Best Short at Örvarpið Festival.</li>
              </ul>

              <h3 className="font-sans text-sm text-foreground mt-6 mb-2">Narrative & Short Films</h3>
              <ul className="space-y-1.5 font-sans text-sm text-muted-foreground leading-relaxed">
                <li>The Bride (2024) | Dir: Hjördis Jóhannsdóttir | Camera: Red Weapon Helium | Winner: Best Icelandic Short at RIFF.</li>
                <li>Þvottur (2018) | Dir: Sigurður Möller Sivertsen | Camera: Sony FS5.</li>
                <li>GRACE (2016) | Dir: Sigurður Möller Sivertsen | Camera: RED ONE Mysterium X.</li>
                <li>Bobby (2013) | Dir: Sigurður Möller Sivertsen | Camera: ARRI SL2 16mm.</li>
                <li>Shots (2013) | Dir: Katherine Harrison | Camera: ARRI SL2 16mm.</li>
                <li>Portrait: Petr Biel (2012) | Documentary | Dir: Sigurður Möller Sivertsen | Camera: Canon 5D MIII & 7D.</li>
              </ul>

              <h3 className="font-sans text-sm text-foreground mt-6 mb-2">Commercials & Branded Content</h3>
              <ul className="space-y-1.5 font-sans text-sm text-muted-foreground leading-relaxed">
                <li>Ittala & Byredo (2026) | Series of Advertisements | Dir: Heimir Gestur Valdimarsson | Camera: Arriflex 435.</li>
                <li>Canada Goose (2026) | Dir: Hampus Nordenson | Camera: Arriflex 435 | Lenses: Cooke s4i.</li>
                <li>Charity (2022) | Series of Advertisements | Dir: Ágúst Bent | Camera: Black Magic Pocket 4K.</li>
              </ul>

              <h3 className="font-sans text-sm text-foreground mt-6 mb-2">Music Videos</h3>
              <ul className="space-y-1.5 font-sans text-sm text-muted-foreground leading-relaxed">
                <li>Grísalappalísa – "Sjáðu hjónin" (2019) | Dir: Sigurður Möller Sivertsen | Camera: Arri Alexa LF.</li>
                <li>Grísalappalísa – "Kvæðaþjófurinn" (2017) | Dir: Sigurður Möller Sivertsen | Camera: Black Magic Pocket 4K.</li>
                <li>Andi – "Lónólongó" (2017) | Dir: Sigurður Möller Sivertsen | Camera: ARRI Alexa XT.</li>
                <li>Grísalappalísa – "ABC" (2014) | Dir: Sigurður Möller Sivertsen | Camera: Canon MIII.</li>
                <li>Grísalappalísa – "Live í Mjóddinni" (2013) | Dir: Sigurður Möller Sivertsen | Camera: Digibeta SX.</li>
                <li>Grísalappalísa – "Skrítin birta" (2013) | Dir: Sigurður Möller Sivertsen | Camera: Canon 7D.</li>
                <li>Grísalappalísa – "Hver er ég" (2013) | Dir: Sigurður Möller Sivertsen | Winner: Best Music Video at the Icelandic Music Awards.</li>
              </ul>
            </section>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:heimirgestur@gmail.com"
              className="block font-mono text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              heimirgestur@gmail.com
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-center gap-6">
              <a
                href="https://www.instagram.com/heimirgestur/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://vimeo.com/user10633087"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                Vimeo
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
