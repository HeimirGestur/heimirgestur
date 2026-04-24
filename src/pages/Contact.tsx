import { Layout } from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-16">
            <h1 className="font-sans text-base font-medium text-foreground mb-1">
              Heimir Gestur Valdimarsson
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Cinematographer · Photographer · Musician
            </p>
          </header>

          {/* Profile */}
          <Section label="Profile">
            <div className="space-y-4">
              <p className="font-sans text-sm text-foreground/80 leading-[1.7]">
                I am an Icelandic cinematographer and photographer, my work is deeply rooted in the traditions of classical cinema. My visual language is shaped by education in the craft as I completed both my Bachelor's and Master's degrees at the National Film School in Łódź.
              </p>
              <p className="font-sans text-sm text-foreground/80 leading-[1.7]">
                This foundation has instilled in me a disciplined approach to the image, particularly through my extensive work with analog film. My aesthetic is defined by technical precision and atmospheric storytelling, applying the weight of classical cinematic traditions to a modern context.
              </p>
              <p className="font-sans text-sm text-foreground/80 leading-[1.7]">
                My portfolio as a Director of Photography includes award-winning short films and music videos recognized by the Reykjavík International Film Festival and the Icelandic Music Awards. This visual work is linked to my background as a musician; having performed with various bands and composed scores for brands such as ACNE and Nordiska Galleriet, I bring a rhythmic, melodic sensibility to the projects I work on.
              </p>
            </div>
          </Section>

          {/* Education */}
          <Section label="Education">
            <p className="font-sans text-sm text-foreground/80 leading-[1.7]">
              The National Film School in Łódź — Master of Arts and Bachelor of Arts in Cinematography.
            </p>
          </Section>

          {/* Filmography */}
          <Section label="Selected Filmography">
            <SubSection title="Director / Director of Photography">
              <FilmItem title="Passage" year="2026" details="Camera: Arri Alexa LF · Lenses: Scorpio" />
              <FilmItem title="PLEŚŃ" year="2024" details="Camera: ARRI Alexa Mini · Lenses: Zeiss Super Speeds" />
              <FilmItem title="RYBA" year="2017" details="Camera: MOVICAM SL 35mm · Lenses: Zeiss Super Speeds" />
              <FilmItem title="KJÖT" year="2013" details="Camera: ARRI 435 35mm · Lenses: Zeiss T1 · Winner: Best Short, Örvarpið Festival" />
            </SubSection>

            <SubSection title="Narrative & Short Films">
              <FilmItem title="Shadow" year="2026" details="Dir: Sigurður Möller Sivertsen · Camera: ARRI Alexa LF" />
              <FilmItem title="The Bride" year="2024" details="Dir: Hjördis Jóhannsdóttir · Camera: Red Weapon Helium · Winner: Best Icelandic Short, RIFF" />
              <FilmItem title="Þvottur" year="2018" details="Dir: Sigurður Möller Sivertsen · Camera: Sony FS5" />
              <FilmItem title="GRACE" year="2016" details="Dir: Sigurður Möller Sivertsen · Camera: RED ONE Mysterium X" />
              <FilmItem title="Bobby" year="2013" details="Dir: Sigurður Möller Sivertsen · Camera: ARRI SL2 16mm" />
              <FilmItem title="Shots" year="2013" details="Dir: Katherine Harrison · Camera: ARRI SL2 16mm" />
              <FilmItem title="Portrait: Petr Biel" year="2012" details="Documentary · Dir: Sigurður Möller Sivertsen · Camera: Canon 5D MIII & 7D" />
            </SubSection>

            <SubSection title="Commercials & Branded Content">
              <FilmItem title="Ittala & Byredo" year="2026" details="Series of Advertisements · Dir: Heimir Gestur Valdimarsson · Camera: Arriflex 435" />
              <FilmItem title="Canada Goose" year="2026" details="Dir: Hampus Nordenson · Camera: Arriflex 435 · Lenses: Cooke s4i" />
              <FilmItem title="Foreldrajafnrétti" year="2022" details="Series of Advertisements · Dir: Ágúst Bent · Camera: Black Magic Pocket 4K" />
            </SubSection>

            <SubSection title="Music Videos" last>
              <FilmItem title={`Grísalappalísa — "Sjáðu hjónin"`} year="2019" details="Dir: Sigurður Möller Sivertsen · Camera: Arri Alexa LF" />
              <FilmItem title={`Grísalappalísa — "Kvæðaþjófurinn"`} year="2017" details="Dir: Sigurður Möller Sivertsen · Camera: Black Magic Pocket 4K" />
              <FilmItem title={`Andi — "Lónólongó"`} year="2017" details="Dir: Sigurður Möller Sivertsen · Camera: ARRI Alexa XT" />
              <FilmItem title={`Grísalappalísa — "ABC"`} year="2014" details="Dir: Sigurður Möller Sivertsen · Camera: Canon MIII" />
              <FilmItem title={`Grísalappalísa — "Live í Mjóddinni"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Camera: Digibeta SX" />
              <FilmItem title={`Grísalappalísa — "Skrítin birta"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Camera: Canon 7D" />
              <FilmItem title={`Grísalappalísa — "Hver er ég"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Winner: Best Music Video, Icelandic Music Awards" />
            </SubSection>
          </Section>

          {/* Contact */}
          <Section label="Contact" last>
            <div className="space-y-3">
              <ContactRow label="Email" href="mailto:heimirgestur@gmail.com" value="heimirgestur@gmail.com" />
              <ContactRow label="Instagram" href="https://www.instagram.com/heimirgestur/" value="@heimirgestur" />
              <ContactRow label="Vimeo" href="https://vimeo.com/user10633087" value="vimeo.com/user10633087" />
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  );
};

const Section = ({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <section
    className={`grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 md:gap-8 py-10 ${
      last ? "" : "border-b border-border"
    }`}
  >
    <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground pt-0.5">
      {label}
    </h2>
    <div>{children}</div>
  </section>
);

const SubSection = ({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <div className={last ? "" : "mb-10"}>
    <h3 className="font-sans text-sm font-medium text-foreground mb-4">
      {title}
    </h3>
    <ul className="space-y-3">{children}</ul>
  </div>
);

const FilmItem = ({
  title,
  year,
  details,
}: {
  title: string;
  year: string;
  details: string;
}) => (
  <li className="font-sans text-sm leading-[1.6]">
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-foreground">{title}</span>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {year}
      </span>
    </div>
    <p className="text-muted-foreground text-[13px] mt-0.5">{details}</p>
  </li>
);

const ContactRow = ({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    className="grid grid-cols-[80px_1fr] gap-4 group"
  >
    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground pt-1">
      {label}
    </span>
    <span className="font-sans text-sm text-foreground group-hover:text-muted-foreground transition-colors">
      {value}
    </span>
  </a>
);

export default Contact;
