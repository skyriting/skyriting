import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Plane, Users, Shield, Award, Target, Heart } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black">About Us</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            About Skyriting
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Elevating private aviation with unmatched service, safety, and luxury
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                Our Mission
              </h2>
              <p className="text-lg text-luxury-black/70 leading-relaxed font-luxury tracking-wide mb-6">
                At Skyriting, we are dedicated to revolutionizing private aviation by providing 
                seamless, luxurious, and safe travel experiences. Our mission is to make premium 
                air travel accessible while maintaining the highest standards of service excellence.
              </p>
              <p className="text-lg text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                We believe that every journey should be extraordinary, and we're committed to 
                delivering personalized aviation solutions that exceed expectations.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-luxury-black/10">
              <Target className="h-16 w-16 text-luxury-red mb-6" />
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                Our Vision
              </h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                To become the world's most trusted and innovative private aviation platform, 
                setting new benchmarks in luxury travel, safety, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Our Core Values
            </h2>
            <div className="w-24 h-0.5 bg-luxury-red mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl text-luxury-black/70 max-w-2xl mx-auto font-luxury tracking-wide">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Shield className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Safety First</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Uncompromising commitment to safety standards and rigorous maintenance protocols 
                ensure every flight meets the highest international safety benchmarks.
              </p>
            </div>

            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Award className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Excellence</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Pursuing excellence in every aspect of our service, from aircraft selection 
                to customer care, ensuring an unparalleled experience.
              </p>
            </div>

            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Heart className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Customer Focus</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Your satisfaction is our priority. We listen, adapt, and go above and beyond 
                to meet your unique travel needs and preferences.
              </p>
            </div>

            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Plane className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Innovation</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Embracing cutting-edge technology and modern aircraft to provide efficient, 
                sustainable, and forward-thinking aviation solutions.
              </p>
            </div>

            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Users className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Integrity</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Transparent pricing, honest communication, and ethical business practices 
                form the foundation of our trusted relationships.
              </p>
            </div>

            <div className="bg-luxury-white-off p-8 rounded-xl border border-luxury-black/5 hover:shadow-xl transition-all duration-300">
              <Target className="h-12 w-12 text-luxury-red mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Reliability</h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Consistent, dependable service you can count on. We deliver on our promises 
                and maintain the highest operational standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Why Choose Skyriting
            </h2>
            <div className="w-24 h-0.5 bg-luxury-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5">
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                Premium Fleet
              </h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Our diverse fleet includes the finest aircraft from turboprops to ultra long-range 
                jets, all meticulously maintained and equipped with the latest amenities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5">
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                Expert Team
              </h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Our experienced aviation professionals bring decades of industry knowledge, 
                ensuring every aspect of your journey is handled with expertise and care.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5">
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                24/7 Support
              </h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Round-the-clock assistance ensures you have support whenever you need it, 
                whether it's booking, flight changes, or emergency situations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5">
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                Global Reach
              </h3>
              <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                Access to airports worldwide, with seamless coordination for international 
                travel, customs, and ground services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Experience the Skyriting Difference
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
            Join thousands of satisfied clients who trust Skyriting for their private aviation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@skyriting.com?subject=Experience the Skyriting Difference"
              className="bg-luxury-red text-white px-8 py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg"
            >
              Book Your Flight
            </a>
            <Link
              to="/contact"
              className="bg-white text-luxury-red px-8 py-4 rounded-lg hover:bg-luxury-white-off transition font-luxury tracking-widest uppercase shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
