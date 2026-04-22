import { Layout } from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          <div className="space-y-5 text-left mb-12">
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              I am an Icelandic cinematographer and photographer whose work is deeply rooted in the traditions of classical cinema. My visual language is shaped by a rigorous education in the craft, having completed both my Bachelor's and Master's degrees at the National Film School in Łódź.
            </p>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              This foundation, paired with my cinematography studies at FAMU in Czechia, has instilled in me a disciplined approach to the image, particularly through my extensive work with analog film. My aesthetic is defined by technical precision and atmospheric storytelling, applying the weight of classical cinematic traditions to a modern context.
            </p>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              My portfolio as a Director of Photography includes award-winning short films and music videos recognized by the Reykjavík International Film Festival and the Icelandic Music Awards. This visual work is inextricably linked to my background as a musician; having performed with various bands and composed scores for brands such as ACNE and Nordiska Galleriet, I bring a rhythmic, melodic sensibility to the projects I work on.
            </p>
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
