import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SellingPoints from '@/components/SellingPoints';
import Residences from '@/components/Residences';
import Gallery from '@/components/Gallery';
import Location from '@/components/Location';
import Calculator from '@/components/Calculator';
import EnquiryForm from '@/components/EnquiryForm';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import JsonLd from '@/components/JsonLd';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return (
    <>
      <JsonLd locale={params.locale} />
      <Header />
      <main id="main">
        <Hero />
        <section id="project"><SellingPoints /></section>
        <section id="residences"><Residences /></section>
        <section id="gallery"><Gallery /></section>
        <section id="location"><Location /></section>
        <section id="calculator"><Calculator /></section>
        <section id="enquire"><EnquiryForm /></section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
