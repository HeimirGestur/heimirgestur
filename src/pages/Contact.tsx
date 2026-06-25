import { Mail, Instagram, Video, Link as LinkIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAboutMe, useContactPage } from "@/hooks/usePortfolioContent";

const fallbackBio = `I am an Icelandic cinematographer and photographer, my work is deeply rooted in the traditions of classical cinema. My visual language is shaped by education in the craft as I completed both my Bachelor's and Master's degrees at the National Film School in Łódź.\n\nThis foundation has instilled in me a disciplined approach to the image, particularly through my extensive work with analog film. My aesthetic is defined by technical precision and atmospheric storytelling, applying the weight of classical cinematic traditions to a modern context.\n\nMy portfolio as a Director of Photography includes award-winning short films and music videos recognized by the Reykjavík International Film Festival and the Icelandic Music Awards. This visual work is linked to my background as a musician; having performed with various bands and composed scores for brands such as ACNE and Nordiska Galleriet, I bring a rhythmic, melodic sensibility to the projects I work on.`;

type IconType = typeof Mail;

const Contact = () => {
  const { data: about } = useAboutMe();
  const { data: contact } = useContactPage();
  const bioParagraphs = (about?.bio || fallbackBio).split("\n").filter(Boolean);

  const emailRows = [
    contact?.features_email && { label: "Features", href: `mailto:${contact.features_email}`, value: contact.features_name ? `${contact.features_name} · ${contact.features_email}` : contact.features_email },
    contact?.commercials_contact_1_email && { label: "Commercials", href: `mailto:${contact.commercials_contact_1_email}`, value: contact.commercials_contact_1_name ? `${contact.commercials_contact_1_name} · ${contact.commercials_contact_1_email}` : contact.commercials_contact_1_email },
    contact?.commercials_contact_2_email && { label: "Commercials", href: `mailto:${contact.commercials_contact_2_email}`, value: contact.commercials_contact_2_name ? `${contact.commercials_contact_2_name} · ${contact.commercials_contact_2_email}` : contact.commercials_contact_2_email },
    contact?.commercials_contact_3_email && { label: "Commercials", href: `mailto:${contact.commercials_contact_3_email}`, value: contact.commercials_contact_3_name ? `${contact.commercials_contact_3_name} · ${contact.commercials_contact_3_email}` : contact.commercials_contact_3_email },
    contact?.music_videos_email && { label: "Music", href: `mailto:${contact.music_videos_email}`, value: contact.music_videos_name ? `${contact.music_videos_name} · ${contact.music_videos_email}` : contact.music_videos_email },
  ].filter(Boolean) as { label: string; href: string; value: string }[];

  const personalEmail = contact?.personal_email || "heimirgestur@gmail.com";
  const instagramUrl = contact?.instagram_url || "https://www.instagram.com/heimirgestur/";
  const instagramHandle = instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "");
  const vimeoUrl = contact?.vimeo_url || "https://vimeo.com/user10633087";
  const vimeoLabel = vimeoUrl.replace(/^https?:\/\//, "");

  const iconLinks: { icon: IconType; href: string; value: string; ariaLabel: string }[] = [
    { icon: Mail, href: `mailto:${personalEmail}`, value: personalEmail, ariaLabel: "Email" },
    { icon: Instagram, href: instagramUrl, value: instagramHandle, ariaLabel: "Instagram" },
    { icon: Video, href: vimeoUrl, value: vimeoLabel, ariaLabel: "Vimeo" },
  ];

  return (
    <Layout>
      <div className="min-h-screen px-6 md:px-12 py-20 md:py-28 font-sans">
        <div className="max-w-xl mx-auto">
          <header className="mb-10">
            <h1 className="text-xs font-medium text-foreground mb-1">
              {contact?.representation_title || "Heimir Gestur Valdimarsson"}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Cinematographer · Photographer · Musician
            </p>
          </header>

          <Section label="Profile">
            <div className="space-y-3">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-xs text-foreground/80 leading-[1.7]">
                  {paragraph}
                </p>
              ))}
            </div>
          </Section>

          <Section label="Education">
            <p className="text-xs text-foreground/80 leading-[1.7]">
              The National Film School in Łódź — Master of Arts and Bachelor of Arts in Cinematography.
            </p>
          </Section>

          <Section label="Filmography">
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
            </SubSection>

            <SubSection title="Commercials & Branded Content">
              <FilmItem title="Ittala & Byredo" year="2026" details="Series of Advertisements · Dir: Heimir Gestur Valdimarsson · Camera: Arriflex 435" />
              <FilmItem title="Canada Goose" year="2026" details="Dir: Hampus Nordenson · Camera: Arriflex 435 · Lenses: Cooke s4i" />
              <FilmItem title="Foreldrajafnrétti" year="2022" details="Series of Advertisements · Dir: Ágúst Bent · Camera: Black Magic Pocket 4K" />
            </SubSection>

            <SubSection title="Music Videos" last>
              <FilmItem title={`Baldur — "DAMN IT"`} year="2023" details="Dir: Árni Jónsson · Camera: Sony AIIIS" />
              <FilmItem title={`Grísalappalísa — "Sjáðu hjónin"`} year="2019" details="Dir: Sigurður Möller Sivertsen · Camera: Arri Alexa LF" />
              <FilmItem title={`Grísalappalísa — "Kvæðaþjófurinn"`} year="2017" details="Dir: Sigurður Möller Sivertsen · Camera: Black Magic Pocket 4K" />
              <FilmItem title={`Andi — "Lónólongó"`} year="2017" details="Dir: Sigurður Möller Sivertsen · Camera: ARRI Alexa XT" />
              <FilmItem title={`Grísalappalísa — "ABC"`} year="2014" details="Dir: Sigurður Möller Sivertsen · Camera: Canon MIII" />
              <FilmItem title={`Grísalappalísa — "Live í Mjóddinni"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Camera: Digibeta SX" />
              <FilmItem title={`Grísalappalísa — "Skrítin birta"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Camera: Canon 7D" />
              <FilmItem title={`Grísalappalísa — "Hver er ég"`} year="2013" details="Dir: Sigurður Möller Sivertsen · Winner: Best Music Video, Icelandic Music Awards" />
            </SubSection>
          </Section>

          <Section label="Contact" last>
            <div className="space-y-2 mb-6">
              {contact?.representation_link && (
                <TextRow label="Rep" href={contact.representation_link} value={contact.representation_link.replace(/^https?:\/\//, "")} />
              )}
              {emailRows.map((row) => (
                <TextRow key={`${row.label}-${row.href}`} {...row} />
              ))}
            </div>

            <div className="flex items-center gap-5 pt-2">
              {iconLinks.map(({ icon: Icon, href, value, ariaLabel }) => (
                <a
                  key={ariaLabel}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={`${ariaLabel}: ${value}`}
                  title={value}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  );
};

const Section = ({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) => (
  <section className={`grid grid-cols-1 md:grid-cols-[110px_1fr] gap-2 md:gap-8 py-7 ${last ? "" : "border-b border-border/40"}`}>
    <h2 className="text-[11px] text-muted-foreground pt-0.5">{label}</h2>
    <div>{children}</div>
  </section>
);

const SubSection = ({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) => (
  <div className={last ? "" : "mb-7"}>
    <h3 className="text-xs font-medium text-foreground mb-3">{title}</h3>
    <ul className="space-y-2.5">{children}</ul>
  </div>
);

const FilmItem = ({ title, year, details }: { title: string; year: string; details: string }) => (
  <li className="text-xs leading-[1.6]">
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-foreground">{title}</span>
      <span className="text-[11px] text-muted-foreground tabular-nums">{year}</span>
    </div>
    <p className="text-muted-foreground text-[11px] mt-0.5">{details}</p>
  </li>
);

const TextRow = ({ label, value, href }: { label: string; value: string; href: string }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    className="grid grid-cols-[80px_1fr] gap-4 group"
  >
    <span className="text-[11px] text-muted-foreground pt-0.5">{label}</span>
    <span className="text-xs text-foreground group-hover:text-muted-foreground transition-colors">{value}</span>
  </a>
);

export default Contact;

