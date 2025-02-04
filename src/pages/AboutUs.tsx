
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">Om Arv.ing</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Vår Historie</h2>
            <p className="text-gray-600 mb-4">
              Arv.ing ble grunnlagt med en klar visjon: å gjøre arveoppgjør enklere og mer
              tilgjengelig for alle. Vi så at mange familier strevde med kompliserte
              prosesser og papirarbeid i en allerede emosjonell tid.
            </p>
            <p className="text-gray-600 mb-4">
              Med vår tekniske ekspertise og juridiske innsikt, har vi utviklet en
              plattform som forenkler hele prosessen og gir familier muligheten til å
              fokusere på det som virkelig betyr noe.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Vårt Team</h2>
            <p className="text-gray-600 mb-4">
              Bak Arv.ing står et dedikert team av teknologer, jurister og
              kundeservicemedarbeidere. Vi kombinerer teknisk innovasjon med dyp
              forståelse for norsk arverett for å skape den beste løsningen for våre
              brukere.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Våre Verdier</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-secondary/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Tilgjengelighet</h3>
                <p className="text-gray-600">
                  Vi gjør kompleks informasjon forståelig og tilgjengelig for alle.
                </p>
              </div>
              <div className="p-6 bg-secondary/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Integritet</h3>
                <p className="text-gray-600">
                  Vi behandler sensitiv informasjon med høyeste grad av sikkerhet og
                  konfidensialitet.
                </p>
              </div>
              <div className="p-6 bg-secondary/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Innovasjon</h3>
                <p className="text-gray-600">
                  Vi utvikler kontinuerlig nye løsninger for å møte brukernes behov.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt Oss</h2>
            <p className="text-gray-600 mb-4">
              Vi er her for å hjelpe deg med spørsmål om arv og skifte. Ta gjerne kontakt
              med oss for mer informasjon om hvordan vi kan assistere deg og din familie.
            </p>
            <div className="bg-secondary/10 p-6 rounded-lg">
              <p className="text-gray-600">E-post: kontakt@arv.ing</p>
              <p className="text-gray-600">Telefon: +47 XX XX XX XX</p>
              <p className="text-gray-600">Adresse: Karl Johans gate XX, Oslo</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
