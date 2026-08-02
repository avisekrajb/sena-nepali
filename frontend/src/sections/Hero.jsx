import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Target,
  Eye,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  Mail,
  Send,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Container } from "../components/ui/Section";
import { heroAPI, leadershipAPI, galleryAPI, contactAPI, contactMessageAPI } from "../services/api";
import toast from "react-hot-toast";

const FALLBACK_IMG = "https://placehold.co/600x600/1F3D2B/FFFFFF?text=Photo";

const services = [
  { title: "Community Welfare", desc: "स्थानीय समुदायको कल्याणका लागि निरन्तर कार्यक्रम।" },
  { title: "Veteran Support", desc: "भूपू सैनिक र आश्रित परिवारलाई प्रत्यक्ष सहयोग।" },
  { title: "Medical Assistance", desc: "स्वास्थ्य शिविर र औषधोपचारमा आर्थिक सहायता।" },
  { title: "Training Programs", desc: "सीप विकास र पुनःस्थापना तालिम।" },
  { title: "Emergency Response", desc: "विपद्को समयमा द्रुत प्रतिकार्य समूह।" },
  { title: "Blood Donation", desc: "नियमित रक्तदान अभियानको संचालन।" },
  { title: "Disaster Relief", desc: "प्रकोप प्रभावितलाई राहत सामग्री वितरण।" },
  { title: "Family Support", desc: "सहिद तथा अवकाशप्राप्त सैनिक परिवारलाई सहयोग।" },
];

const pillars = [
  {
    title: "Mission",
    text: "भूपू सैनिकहरूको एकता, कल्याण र समाज सेवामार्फत राष्ट्र निर्माणमा योगदान।",
  },
  {
    title: "Vision",
    text: "मर्यादित, आत्मनिर्भर र सामाजिक जिम्मेवारीयुक्त भूपू सैनिक समुदाय।",
  },
  {
    title: "Objectives",
    text: "कल्याण, सीप विकास, स्वास्थ्य सेवा, विपद् व्यवस्थापन र सामुदायिक कार्यक्रम।",
  },
  { title: "Core Values", text: "अनुशासन, इमानदारी, देशभक्ति, सेवा र आपसी सम्मान।" },
];

const timeline = [
  { year: "Foundation", title: "Formation of the Association", desc: "स्थापनाकालमै अवकाशप्राप्त सैनिकहरूको साझा मञ्चको परिकल्पना गरियो।" },
  { year: "Early Years", title: "Chapter Expansion", desc: "देशभरका जिल्लामा शाखा विस्तार र सदस्य दर्ताको सुरुवात।" },
  { year: "Growth", title: "Welfare Programs", desc: "स्वास्थ्य शिविर, राहत वितरण र परिवार सहयोग कार्यक्रमको थालनी।" },
  { year: "Today", title: "Nationwide Presence", desc: "७७ वटै जिल्लामा प्रतिनिधित्व र निरन्तर सामुदायिक सेवा।" },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const staggerServices = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export function Hero() {
  const rootRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const [seniorSlide, setSeniorSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef(null);
  const touchRef = useRef(null);
  
  const [heroData, setHeroData] = useState({ carouselImages: [], seniors: [] });
  const [leadershipMembers, setLeadershipMembers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [showAllLeadership, setShowAllLeadership] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const initialDisplay = 8;

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [heroRes, leadershipRes, galleryRes, contactRes] = await Promise.all([
        heroAPI.getHero(),
        leadershipAPI.getLeadership(),
        galleryAPI.getGallery(),
        contactAPI.getContact()
      ]);
      setHeroData(heroRes.data);
      setLeadershipMembers(leadershipRes.data);
      const images = galleryRes.data.filter(item => item.type !== 'video');
      setGalleryItems(images);
      setContact(contactRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const photos = heroData.carouselImages?.length > 0 
    ? heroData.carouselImages 
    : [
        { url: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1000&h=750&fit=crop", id: 1 },
        { url: "https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=1000&h=750&fit=crop", id: 2 },
        { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&h=750&fit=crop", id: 3 },
      ];

  const personData = heroData.seniors?.length > 0 ? heroData.seniors : [];

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlide((p) => (p + 1) % photos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlide((p) => (p - 1 + photos.length) % photos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSenior = () => {
    const totalSlides = Math.max(1, Math.ceil(personData.length / 2));
    setSeniorSlide((p) => (p + 1) % totalSlides);
  };

  const prevSenior = () => {
    const totalSlides = Math.max(1, Math.ceil(personData.length / 2));
    setSeniorSlide((p) => (p - 1 + totalSlides) % totalSlides);
  };

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (!isDragging && photos.length > 1) autoRef.current = setInterval(next, 4000);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = startX - touch.clientX;
    setCurrentTranslate(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(currentTranslate) > 50) {
      if (currentTranslate > 0) next();
      else prev();
    }
    setCurrentTranslate(0);
    resetAuto();
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    setCurrentTranslate(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(currentTranslate) > 50) {
      if (currentTranslate > 0) next();
      else prev();
    }
    setCurrentTranslate(0);
    resetAuto();
  };

  const [seniorStartX, setSeniorStartX] = useState(0);
  const [seniorTranslate, setSeniorTranslate] = useState(0);
  const [isSeniorDragging, setIsSeniorDragging] = useState(false);

  const handleSeniorTouchStart = (e) => {
    const touch = e.touches[0];
    setSeniorStartX(touch.clientX);
    setIsSeniorDragging(true);
  };

  const handleSeniorTouchMove = (e) => {
    if (!isSeniorDragging) return;
    const touch = e.touches[0];
    const diff = seniorStartX - touch.clientX;
    setSeniorTranslate(diff);
  };

  const handleSeniorTouchEnd = () => {
    setIsSeniorDragging(false);
    if (Math.abs(seniorTranslate) > 50) {
      if (seniorTranslate > 0) nextSenior();
      else prevSenior();
    }
    setSeniorTranslate(0);
  };

  const handleSeniorMouseDown = (e) => {
    setSeniorStartX(e.clientX);
    setIsSeniorDragging(true);
  };

  const handleSeniorMouseMove = (e) => {
    if (!isSeniorDragging) return;
    const diff = seniorStartX - e.clientX;
    setSeniorTranslate(diff);
  };

  const handleSeniorMouseUp = () => {
    setIsSeniorDragging(false);
    if (Math.abs(seniorTranslate) > 50) {
      if (seniorTranslate > 0) nextSenior();
      else prevSenior();
    }
    setSeniorTranslate(0);
  };

  useEffect(() => {
    if (!isDragging && photos.length > 1) autoRef.current = setInterval(next, 4000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [isDragging, photos.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title", { y: 50, opacity: 0, duration: 0.9, delay: 0.1 })
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-badge", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.3")
        .from(".about-section", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(".service-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".leadership-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".gallery-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from(".contact-section", { y: 40, opacity: 0, duration: 0.7 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    try {
      await contactMessageAPI.createMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const displayedLeadership = showAllLeadership ? leadershipMembers : leadershipMembers.slice(0, initialDisplay);
  const displayedGallery = galleryItems.slice(0, initialDisplay);
  const hasMoreGallery = galleryItems.length > initialDisplay;

  const getVisibleSeniors = () => {
    const start = seniorSlide * 2;
    return personData.slice(start, start + 2);
  };

  const visibleSeniors = getVisibleSeniors();
  const totalSeniorSlides = Math.max(1, Math.ceil(personData.length / 2));

  if (loading) {
    return (
      <section ref={rootRef} className="min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"
        />
      </section>
    );
  }

  return (
    <section ref={rootRef} className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[100svh] flex flex-col">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=2000&q=80&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,161,91,0.08)_0%,transparent_60%)]" />
        </div>

        <div className="flex-1 flex items-center pt-40 pb-8">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Carousel */}
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-xl mx-auto lg:mr-auto"
              >
                <div
                  ref={touchRef}
                  className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <motion.div
                    className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
                    style={{ 
                      transform: `translateX(${-slide * 100 + (currentTranslate / touchRef.current?.offsetWidth || 0) * 100}%)`,
                      transition: isDragging ? 'none' : 'transform 500ms ease-out'
                    }}
                  >
                    {photos.map((p, index) => (
                      <motion.div 
                        key={index} 
                        className="min-w-full aspect-[4/3] relative bg-gray-50"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={p.url}
                          alt=""
                          className="w-full h-full object-cover object-top"
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
                        <motion.div 
                          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {index + 1} / {photos.length}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {photos.length > 1 && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prev} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2.5 rounded-full transition-all z-10 border border-gray-200 shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={next} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2.5 rounded-full transition-all z-10 border border-gray-200 shadow-md"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {photos.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => { setSlide(i); resetAuto(); }}
                        className={`w-2 h-2 rounded-full transition-all ${slide === i ? "bg-gold w-6" : "bg-white/60 hover:bg-white/80"}`}
                        whileHover={{ scale: 1.3 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Content */}
              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
              >
             <motion.h1
  className="hero-title font-display font-bold text-green-900 text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.35] tracking-tight"
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
  राष्ट्र सेवाबाट
  <br />
  <motion.span
    className="text-gold inline-block mt-4" // Increased from mt-2 to mt-4
    whileHover={{ color: "#8B2331" }}
    transition={{ duration: 0.3 }}
  >
    समाज सेवातर्फ
  </motion.span>
</motion.h1>
                <motion.p 
                  className="hero-sub mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed"
                  variants={fadeInUp}
                >
                  नेपालका भूपू सैनिकहरूको एकता, सम्मान, सेवा र राष्ट्र निर्माणप्रतिको निरन्तर प्रतिबद्धता।
                </motion.p>

                {/* Seniors Slider */}
                {personData.length > 0 && (
                  <div className="mt-8 relative">
                    <div 
                      className="overflow-hidden"
                      onTouchStart={handleSeniorTouchStart}
                      onTouchMove={handleSeniorTouchMove}
                      onTouchEnd={handleSeniorTouchEnd}
                      onMouseDown={handleSeniorMouseDown}
                      onMouseMove={handleSeniorMouseMove}
                      onMouseUp={handleSeniorMouseUp}
                      onMouseLeave={handleSeniorMouseUp}
                    >
                      <div 
                        className="grid grid-cols-2 gap-4 transition-all duration-500 ease-in-out"
                      >
                        {visibleSeniors.map((p, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all group shadow-sm hover:shadow-md"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gold/10 border-2 border-gold/30 group-hover:border-gold/60 transition-all group-hover:scale-105">
                                <img 
                                  src={p.image} 
                                  alt={p.name} 
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              </div>
                              <h4 className="mt-3 font-bold text-base text-army group-hover:text-army transition-colors text-center">
                                {p.name}
                              </h4>
                              <p className="text-gray-600 text-sm font-medium text-center">{p.role}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {personData.length > 2 && (
                      <div className="flex justify-center gap-1.5 mt-4">
                        {Array.from({ length: totalSeniorSlides }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSeniorSlide(i)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              seniorSlide === i ? "bg-gold w-6" : "bg-gray-300 hover:bg-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </Container>
        </div>

        {/* Features - Green Border */}
        <motion.div 
          className="relative pb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                className="border-2 border-green-700/20 rounded-2xl p-6 hover:border-green-700/50 transition-all bg-white/50 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-army">Unity & Brotherhood</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">Join a community of veterans committed to national unity and social harmony.</p>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                className="border-2 border-green-700/20 rounded-2xl p-6 hover:border-green-700/50 transition-all bg-white/50 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-army">Social Service</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">Dedicated to serving society through various welfare programs and initiatives.</p>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                className="border-2 border-green-700/20 rounded-2xl p-6 hover:border-green-700/50 transition-all bg-white/50 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-army">National Pride</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">Continuing our service to the nation with honor, dignity, and commitment.</p>
              </motion.div>
            </div>
          </Container>
        </motion.div>
      </div>

      {/* About Section - No Dot, No Icons */}
    {/* About Section - No Dot, No Icons */}
<motion.section 
  className="about-section py-20 pt-10 bg-white border-t border-gray-100"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
>
  <Container>
    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
      <motion.div variants={fadeInUp}>
        {/* Added "About the Association" heading */}
        <div className="text-lg md:text-xl font-semibold uppercase tracking-[0.14em] text-green-600 mb-3">
          About the Association
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-army leading-[1.35]">
          भूपू सैनिकहरूको साझा मञ्च
          <br />
          <span className="text-gold inline-block mt-2">
            सम्मान र सेवाको निरन्तरता
          </span>
        </h2>
        <div className="mt-6 space-y-5 text-gray-600 leading-relaxed">
          <p className="text-lg md:text-xl text-justify">
            नेपाल भूपू सैनिक संघ अवकाशप्राप्त नेपाली सैनिकहरूको एक स्वयंसेवी सामाजिक संस्था हो। 
            लामो सैन्य सेवापछि पनि राष्ट्र र समाजप्रतिको जिम्मेवारीलाई निरन्तरता दिँदै यो 
            संस्थाले एकजुट भूपू सैनिक परिवारको निर्माण गरेको छ।
          </p>
          <p className="text-lg md:text-xl text-justify">
            कल्याण, स्वास्थ्य सहयोग, सीप विकास, विपद् प्रतिकार्य, रक्तदान अभियान र सामुदायिक 
            विकासजस्ता क्षेत्रमा संस्था सक्रिय रहँदै आएको छ। अवकाशप्राप्त सैनिक तथा उनका 
            परिवारको जीवनयापन मर्यादित बनाउनु र देशको सामाजिक ताँदो थप बलियो बनाउनु हाम्रो 
            प्राथमिकता हो।
          </p>
        </div>

        {/* Pillars - No Icons */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
              className="bg-white/80 border border-gray-200 p-5 rounded-xl hover:border-gold/40 transition-all shadow-sm hover:shadow-md"
            >
              <h3 className="text-base font-semibold text-army">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative">
        <div className="text-lg md:text-xl font-semibold uppercase tracking-[0.14em] text-green-600 mb-4">
          Our Journey
        </div>
        <div className="relative pl-7 border-l-2 border-green-500/40">
          {timeline.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ x: 8 }}
              className="relative pb-6 last:pb-0"
            >
              <span className="absolute -left-[33px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white border-2 border-green-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              <div className="text-xs font-semibold uppercase tracking-widest text-green-600">
                {t.year}
              </div>
              <h3 className="mt-1 text-base font-semibold text-army">{t.title}</h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Container>
</motion.section>

      {/* Services Section - 8 Cards with Framer Motion */}
     {/* Services Section - 8 Cards with Green Border */}
<motion.section 
  className="py-20 bg-gray-50"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={staggerServices}
>
  <Container>
    <motion.div className="text-center mb-12" variants={fadeInUp}>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-2">सेवाका क्षेत्रहरू</h2>
    </motion.div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {services.map((service, index) => (
        <motion.div 
          key={index} 
          variants={fadeInUp}
          whileHover={{ y: -10, scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
          className="service-card bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-green-700/20 hover:border-green-700/50 text-center"
        >
          <h3 className="font-semibold text-army text-base md:text-lg">{service.title}</h3>
          <p className="text-gray-600 text-sm md:text-base mt-2 leading-relaxed">{service.desc}</p>
        </motion.div>
      ))}
    </div>
  </Container>
</motion.section>

      {/* Leadership Section */}
      <motion.section 
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <motion.div className="text-center mb-10" variants={fadeInUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-army mt-2">केन्द्रीय सञ्चालन समिति</h2>
            <p className="text-gray-600 text-base mt-2">नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको नेतृत्व टोली</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedLeadership.map((member) => (
              <motion.div 
                key={member._id} 
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                className="leadership-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-army text-sm truncate">{member.name}</h3>
                  <p className="text-xs text-gold-dark font-medium truncate">{member.role}</p>
                  {member.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {leadershipMembers.length > initialDisplay && (
            <div className="text-center mt-6">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(201, 162, 39, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllLeadership(!showAllLeadership)} 
                className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm"
              >
                {showAllLeadership ? 'Show Less' : `View All (${leadershipMembers.length})`}
              </motion.button>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <motion.div className="text-center mb-10" variants={fadeInUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-army mt-2">तस्बिर संग्रह</h2>
            <p className="text-gray-600 text-base mt-2">विभिन्न कार्यक्रम, बैठक र सामुदायिक सेवाका दृश्यहरू।</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedGallery.map((item) => (
              <motion.div 
                key={item._id} 
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)" }}
                className="gallery-card group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={item.url} 
                  alt={item.title || 'Gallery'} 
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>

          {hasMoreGallery && (
            <div className="text-center mt-6">
              <Link to="/gallery">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(201, 162, 39, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  View All ({galleryItems.length} photos)
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Contact Section - Green Background */}
      <motion.section 
        className="contact-section py-16 bg-green-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Container>
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-8" variants={fadeInUp}>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-army mt-2">सम्पर्क गर्नुहोस्</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div className="space-y-3" variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gold/10 p-2 rounded-lg"><MapPin className="h-5 w-5 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Address</h4><p className="text-gray-600 text-sm">{contact?.address || 'Kathmandu, Nepal'}</p></div>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gold/10 p-2 rounded-lg"><Phone className="h-5 w-5 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Phone</h4><p className="text-gray-600 text-sm">{contact?.phone || '+977-1-1234567'}</p></div>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gold/10 p-2 rounded-lg"><Mail className="h-5 w-5 text-gold" /></div>
                  <div><h4 className="font-medium text-army text-sm">Email</h4><p className="text-gray-600 text-sm">{contact?.email || 'info@nepalarmy.org'}</p></div>
                </motion.div>

                <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden shadow-md border border-gray-200 h-48">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28266.030921880483!2d85.2854008!3d27.7034568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a0b7caa7b%3A0x9a0ccb4aa8c28258!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location Map"
                    className="w-full h-full"
                  />
                </motion.div>
              </motion.div>

              <motion.div 
                className="bg-white/90 p-6 rounded-xl shadow-md"
                variants={fadeInUp}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <textarea 
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      rows="4" 
                      placeholder="Your Message" 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm" 
                      required 
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={sending}
                    className="w-full bg-gold text-white py-3 rounded-lg hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </motion.button>
                  {submitted && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm text-center font-medium"
                    >
                      ✅ Message sent successfully!
                    </motion.p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </Container>
      </motion.section>
    </section>
  );
}

export default Hero;
