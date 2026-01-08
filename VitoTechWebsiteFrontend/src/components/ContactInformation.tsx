import { 
  PhoneIcon, 
  MapPinIcon, 
  GlobeAltIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

export default function ContactInformation() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Contact Information
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch with us through any of these channels
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Phones Card */}
          <article className="group flex flex-col items-center bg-gray-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200">
            <div className="mb-8">
              <PhoneIcon className="h-16 w-16 text-gray-900" />
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-4 text-center uppercase tracking-wide">
              Call Us
            </h3>
            
            <div className="space-y-3 w-full">
              <a 
                href="tel:+255678665780"
                className="block text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-sm"
              >
                +255-678-665-780
              </a>
              <a 
                href="tel:+255672969004"
                className="block text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-sm"
              >
                +255-672-969-004
              </a>
              <a 
                href="tel:+255753786912"
                className="block text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-sm"
              >
                +255-753-786-912
              </a>
              <a 
                href="tel:+255627857470"
                className="block text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-sm"
              >
                +255-627-857-470
              </a>
            </div>
          </article>

          {/* Address Card */}
          <article className="group flex flex-col items-center bg-gray-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200">
            <div className="mb-8">
              <MapPinIcon className="h-16 w-16 text-gray-900" />
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center uppercase tracking-wide">
              Our Location
            </h3>
            
            <p className="text-center text-gray-700 font-medium text-base">
              Iyumbu-Dodoma, Tanzania
            </p>
          </article>

          {/* Website Card */}
          <article className="group flex flex-col items-center bg-gray-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200">
            <div className="mb-8">
              <GlobeAltIcon className="h-16 w-16 text-gray-900" />
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center uppercase tracking-wide">
              Website
            </h3>
            
            <a 
              href="https://www.vitohub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-base"
            >
              www.vitohub.org
            </a>
          </article>

          {/* Email Card */}
          <article className="group flex flex-col items-center bg-gray-50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg border border-gray-200">
            <div className="mb-8">
              <EnvelopeIcon className="h-16 w-16 text-gray-900" />
            </div>
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center uppercase tracking-wide">
              Email
            </h3>
            
            <a 
              href="mailto:info@vitohub.org"
              className="text-center text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 text-base"
            >
              info@vitohub.org
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}