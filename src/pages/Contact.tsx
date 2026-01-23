import { Layout } from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="font-sans text-3xl font-light text-foreground mb-8">
            Get in Touch
          </h1>
          <div className="space-y-4">
            <p className="font-sans text-base text-muted-foreground">
              For inquiries about projects, collaborations, or representations:
            </p>
            <a
              href="mailto:hello@example.com"
              className="block font-mono text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              hello@example.com
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="font-sans text-xs text-muted-foreground mb-4">
              Follow
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-foreground hover:text-muted-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://vimeo.com"
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
