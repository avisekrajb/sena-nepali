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

// Timeline animation variants - up to down
const timelineVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut"
    }
  })
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
  const seniorAutoRef = useRef(null);
  const [isSeniorPaused, setIsSeniorPaused] = useState(false);
  
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

  // Senior auto-slide with pause functionality
  const startSeniorAuto = () => {
    if (seniorAutoRef.current) clearInterval(seniorAutoRef.current);
    if (!isSeniorPaused && personData.length > 1) {
      seniorAutoRef.current = setInterval(nextSenior, 3000);
    }
  };

  const stopSeniorAuto = () => {
    if (seniorAutoRef.current) {
      clearInterval(seniorAutoRef.current);
      seniorAutoRef.current = null;
    }
  };

  const handleSeniorMouseEnter = () => {
    setIsSeniorPaused(true);
    stopSeniorAuto();
  };

  const handleSeniorMouseLeave = () => {
    setIsSeniorPaused(false);
    startSeniorAuto();
  };

  const [seniorStartX, setSeniorStartX] = useState(0);
  const [seniorTranslate, setSeniorTranslate] = useState(0);
  const [isSeniorDragging, setIsSeniorDragging] = useState(false);
  const [seniorTouchStartX, setSeniorTouchStartX] = useState(0);
  const [seniorTouchTranslate, setSeniorTouchTranslate] = useState(0);
  const [isSeniorTouchDragging, setIsSeniorTouchDragging] = useState(false);

  // Handle touch events for seniors with smooth sliding
  const handleSeniorTouchStart = (e) => {
    setIsSeniorPaused(true);
    stopSeniorAuto();
    const touch = e.touches[0];
    setSeniorTouchStartX(touch.clientX);
    setIsSeniorTouchDragging(true);
    setSeniorTouchTranslate(0);
  };

  const handleSeniorTouchMove = (e) => {
    if (!isSeniorTouchDragging) return;
    const touch = e.touches[0];
    const diff = seniorTouchStartX - touch.clientX;
    setSeniorTouchTranslate(diff);
  };

  const handleSeniorTouchEnd = () => {
    setIsSeniorTouchDragging(false);
    const threshold = 50;
    if (Math.abs(seniorTouchTranslate) > threshold) {
      if (seniorTouchTranslate > 0) {
        nextSenior();
      } else {
        prevSenior();
      }
    }
    setSeniorTouchTranslate(0);
    setTimeout(() => {
      setIsSeniorPaused(false);
      startSeniorAuto();
    }, 3000);
  };

  // Handle mouse events for seniors with smooth sliding
  const handleSeniorMouseDown = (e) => {
    setSeniorStartX(e.clientX);
    setIsSeniorDragging(true);
    setIsSeniorPaused(true);
    stopSeniorAuto();
  };

  const handleSeniorMouseMove = (e) => {
    if (!isSeniorDragging) return;
    const diff = seniorStartX - e.clientX;
    setSeniorTranslate(diff);
  };

  const handleSeniorMouseUp = () => {
    setIsSeniorDragging(false);
    const threshold = 50;
    if (Math.abs(seniorTranslate) > threshold) {
      if (seniorTranslate > 0) {
        nextSenior();
      } else {
        prevSenior();
      }
    }
    setSeniorTranslate(0);
    setTimeout(() => {
      setIsSeniorPaused(false);
      startSeniorAuto();
    }, 3000);
  };

  // Main carousel touch handlers
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

  useEffect(() => {
    if (personData.length === 0) return;
    startSeniorAuto();
    return () => stopSeniorAuto();
  }, [personData.length]);

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

        <div className="flex-1 flex items-center pt-32 md:pt-40 lg:pt-48 pb-8">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
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
                      </motion.div>
                    ))}
                  </motion.div>

                  {photos.length > 1 && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prev} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2 rounded-full transition-all z-10 border border-gray-200 shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#C9A227", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={next} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-gold text-gray-700 hover:text-white p-2 rounded-full transition-all z-10 border border-gray-200 shadow-md"
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
                  className="hero-title font-display font-bold text-green-900 text-4xl sm:text-4xl md:text-5xl lg:text-[4.25rem] leading-[1.35] tracking-tight"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  राष्ट्र सेवाबाट
                  <br />
                  <motion.span
                 className="text-[#26532F] inline-block mt-4 md:mt-6"
             whileHover={{ color: "#26532F" }}
                    transition={{ duration: 0.3 }}
                  >
                    समाज सेवातर्फ
                  </motion.span>
                </motion.h1>
               <motion.p
  className="hero-sub mt-4 md:mt-6 max-w-2xl text-lg sm:text-lg md:text-xl text-gray-700 leading-relaxed font-bold italic"
  variants={fadeInUp}
>
  नेपालका भूपू सैनिकहरूको एकता, सम्मान, सेवा र राष्ट्र निर्माणप्रतिको निरन्तर प्रतिबद्धता।
</motion.p>

                {/* Seniors Slider - 2/2 Grid with Continuous 360 Rotation Effect */}
                {personData.length > 0 && (
                  <div className="mt-6 md:mt-8 relative">
                    <div 
                      className="relative overflow-hidden rounded-xl"
                      onMouseEnter={handleSeniorMouseEnter}
                      onMouseLeave={handleSeniorMouseLeave}
                      onTouchStart={handleSeniorTouchStart}
                      onTouchMove={handleSeniorTouchMove}
                      onTouchEnd={handleSeniorTouchEnd}
                      onMouseDown={handleSeniorMouseDown}
                      onMouseMove={handleSeniorMouseMove}
                      onMouseUp={handleSeniorMouseUp}
                    >
                      <div className="overflow-hidden">
                        <motion.div 
                          className="grid grid-cols-2 gap-3 md:gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            transform: isSeniorTouchDragging 
                              ? `translateX(${-seniorTouchTranslate}px)` 
                              : isSeniorDragging 
                                ? `translateX(${-seniorTranslate}px)`
                                : 'translateX(0)'
                          }}
                        >
                          {visibleSeniors.map((p, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                rotateY: 0,
                                transition: { 
                                  duration: 0.6, 
                                  delay: i * 0.1, 
                                  ease: "easeOut" 
                                }
                              }}
                              whileHover={{ 
                                scale: 1.08, 
                                y: -5, 
                                rotateY: 10,
                                transition: { duration: 0.3 }
                              }}
                              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 md:p-4 hover:bg-gray-50 transition-all group shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
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
                                <h4 className="mt-2 md:mt-3 font-bold text-sm md:text-base text-army group-hover:text-army transition-colors text-center">
                                  {p.name}
                                </h4>
                                <p className="text-gray-700 text-xs md:text-sm font-medium text-center">{p.role}</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Dot indicators for seniors */}
                      {totalSeniorSlides > 1 && (
                        <div className="flex justify-center gap-2 mt-3">
                          {Array.from({ length: totalSeniorSlides }).map((_, i) => (
                            <motion.button
                              key={i}
                              onClick={() => {
                                setSeniorSlide(i);
                                stopSeniorAuto();
                                setTimeout(() => {
                                  setIsSeniorPaused(false);
                                  startSeniorAuto();
                                }, 3000);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                seniorSlide === i 
                                  ? "bg-gold w-6" 
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              whileHover={{ scale: 1.3 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </Container>
        </div>
      </div>

      {/* About Section */}
      <motion.section 
        className="about-section py-12 md:py-20 pt-8 md:pt-10 bg-white border-t border-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Container>
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 md:gap-8 lg:gap-12 items-start">
            <motion.div variants={fadeInUp}>
              <div className="text-base md:text-lg lg:text-xl font-semibold uppercase tracking-[0.14em] text-green-600 mb-2 md:mb-3">
                About the Association
              </div>
              <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army leading-[1.35]">
                भूपू सैनिकहरूको साझा मञ्च
                <br />
                <span className="text-gold inline-block mt-2">
                  सम्मान र सेवाको निरन्तरता
                </span>
              </h2>
              <div className="mt-4 md:mt-6 space-y-4 md:space-y-5 text-gray-600 leading-relaxed">
                <p className="text-base md:text-base lg:text-lg text-justify">
                  नेपाल भूपू सैनिक संघ अवकाशप्राप्त नेपाली सैनिकहरूको एक स्वयंसेवी सामाजिक संस्था हो। 
                  लामो सैन्य सेवापछि पनि राष्ट्र र समाजप्रतिको जिम्मेवारीलाई निरन्तरता दिँदै यो 
                  संस्थाले एकजुट भूपू सैनिक परिवारको निर्माण गरेको छ।
                </p>
                <p className="text-base md:text-base lg:text-lg text-justify">
                  कल्याण, स्वास्थ्य सहयोग, सीप विकास, विपद् प्रतिकार्य, रक्तदान अभियान र सामुदायिक 
                  विकासजस्ता क्षेत्रमा संस्था सक्रिय रहँदै आएको छ। अवकाशप्राप्त सैनिक तथा उनका 
                  परिवारको जीवनयापन मर्यादित बनाउनु र देशको सामाजिक ताँदो थप बलियो बनाउनु हाम्रो 
                  प्राथमिकता हो।
                </p>
              </div>

              {/* Pillars - With #FCC202 border */}
              <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {pillars.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(252, 194, 2, 0.3)" }}
                    className="bg-white/80 border-2 p-4 md:p-5 rounded-xl transition-all shadow-sm hover:shadow-md"
                    style={{ borderColor: "#FCC202" }}
                  >
                    <h3 className="text-base md:text-base font-semibold text-army">{p.title}</h3>
                    <p className="mt-1 text-sm md:text-sm text-gray-700 leading-relaxed">{p.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Journey */}
            <div className="relative">
              <div className="text-base md:text-lg lg:text-xl font-semibold uppercase tracking-[0.14em] text-green-600 mb-2 md:mb-3">
                Our Journey
              </div>
              <div className="relative pl-5 md:pl-7 border-l-2 border-green-500/40 mt-4 md:mt-6">
                {timeline.map((t, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={timelineVariants}
                    whileHover={{ x: 4 }}
                    className="relative pb-4 md:pb-6 last:pb-0"
                  >
                    <span className="absolute -left-[25px] md:-left-[33px] top-1 grid h-3 w-3 md:h-4 md:w-4 place-items-center rounded-full bg-white border-2 border-green-500">
                      <motion.span 
                        className="h-1.5 w-1.5 rounded-full bg-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.15 + 0.3 }}
                      />
                    </span>
                    <div className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-green-600">
                      {t.year}
                    </div>
                    <h3 className="mt-1 text-base md:text-base font-semibold text-army">{t.title}</h3>
                    <p className="mt-1 text-sm md:text-sm text-gray-700 leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="py-12 md:py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerServices}
      >
        <Container>
          <motion.div className="text-center mb-8 md:mb-12" variants={fadeInUp}>
            <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-2">सेवाका क्षेत्रहरू</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 40px -12px rgba(34, 197, 94, 0.2)" }}
                className="service-card bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-green-500 text-center relative"
              >
                <h3 className="font-semibold text-army text-base md:text-base lg:text-lg">{service.title}</h3>
                <p className="text-gray-700 text-sm md:text-sm lg:text-base mt-2 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* Leadership Section */}
      <motion.section 
        className="py-12 md:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <motion.div className="text-center mb-8 md:mb-10" variants={fadeInUp}>
            <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-2">केन्द्रीय सञ्चालन समिति</h2>
            <p className="text-gray-600 text-base md:text-base mt-2">नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको नेतृत्व टोली</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {displayedLeadership.map((member) => (
              <motion.div 
                key={member._id} 
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                className="leadership-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 md:p-3 text-center">
                  <h3 className="font-semibold text-army-dark text-sm md:text-sm truncate">{member.name}</h3>
                  <p className="text-xs md:text-sm text-gold-dark font-semibold truncate">{member.role}</p>
                  {member.bio && <p className="text-xs md:text-xs text-gray-700 mt-1 line-clamp-2">{member.bio}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {leadershipMembers.length > 0 && (
            <div className="text-center mt-6">
              <Link to="/central-committee">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(201, 162, 39, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-gold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm md:text-sm font-medium"
                >
                  View All
                  <ArrowRight className="h-4 w-4 md:h-4 md:w-4" />
                </motion.button>
              </Link>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
        className="py-12 md:py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <Container>
          <motion.div className="text-center mb-8 md:mb-10" variants={fadeInUp}>
            <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-2">तस्बिर संग्रह</h2>
            <p className="text-gray-600 text-base md:text-base mt-2">विभिन्न कार्यक्रम, बैठक र सामुदायिक सेवाका दृश्यहरू।</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
                  className="inline-flex items-center gap-2 bg-gold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm md:text-sm font-medium"
                >
                  View All
                  <ArrowRight className="h-4 w-4 md:h-4 md:w-4" />
                </motion.button>
              </Link>
            </div>
          )}
        </Container>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="contact-section py-12 md:py-16 bg-green-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-6 md:mb-8" variants={fadeInUp}>
              <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army mt-2">सम्पर्क गर्नुहोस्</h2>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-200/50"
              variants={fadeInUp}
            >
              <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left - Contact Form */}
                <div className="p-5 md:p-8 order-1 lg:order-1">
                  <h3 className="text-xl md:text-xl font-semibold text-army mb-4 md:mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                    <div>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="Your Name" 
                        className="w-full px-3 md:px-4 py-3 md:py-3 bg-gray-50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all hover:border-green-300" 
                        required 
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        placeholder="Your Email" 
                        className="w-full px-3 md:px-4 py-3 md:py-3 bg-gray-50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all hover:border-green-300" 
                        required 
                      />
                    </div>
                    <div>
                      <textarea 
                        value={formData.message} 
                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                        rows="3" 
                        placeholder="Your Message" 
                        className="w-full px-3 md:px-4 py-3 md:py-3 bg-gray-50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all resize-none hover:border-green-300" 
                        required 
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={sending}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 text-base font-medium disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                      {sending ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" /> Send Message
                        </>
                      )}
                    </motion.button>
                    {submitted && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-base text-center font-medium"
                      >
                        ✅ Message sent successfully!
                      </motion.p>
                    )}
                  </form>
                </div>

                {/* Right - Contact Info with Map */}
                <div className="p-5 md:p-8 bg-gradient-to-br from-green-50 to-white border-l border-green-100 order-2 lg:order-2">
                  <h3 className="text-xl md:text-xl font-semibold text-army mb-4 md:mb-6">Get in Touch</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-200">
                      <div className="bg-green-100 p-2 md:p-3 rounded-lg shrink-0">
                        <MapPin className="h-5 w-5 md:h-5 md:w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm md:text-sm font-medium text-gray-500">Address</p>
                        <p className="text-base md:text-base text-gray-700">Morang</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-200">
                      <div className="bg-green-100 p-2 md:p-3 rounded-lg shrink-0">
                        <Phone className="h-5 w-5 md:h-5 md:w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm md:text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-base md:text-base text-gray-700">9824380897</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-200">
                      <div className="bg-green-100 p-2 md:p-3 rounded-lg shrink-0">
                        <Mail className="h-5 w-5 md:h-5 md:w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm md:text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base md:text-base text-gray-700">nepalisena@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-4 md:mt-6 rounded-xl overflow-hidden shadow-md h-40 md:h-40 border border-green-200 w-full">
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
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </motion.section>
    </section>
  );
}

export default Hero;  
