import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { centralCommitteeAPI } from '../services/api';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CentralCommittee = () => {
  const [committeeData, setCommitteeData] = useState({
    title: 'केन्द्रीय कार्यसमिति',
    members: [],
    districtTitle: 'जिल्ला कार्यसमिति',
    districtMembers: [],
    regionalTitle: 'क्षेत्रीय सभापति',
    regionalMembers: [],
    unitTitle: 'इकाई सभापति',
    unitMembers: [],
    provincialTitle: 'प्रदेश संयोजक',
    provincialMembers: [],
    centralMembersTitle: 'केन्द्रीय सदस्य',
    centralMembers: [],
    advisoryTitle: 'सलाहकार मण्डल',
    advisoryMembers: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState({});

  const sections = [
    { key: 'members', label: 'केन्द्रीय कार्यसमिति', defaultShow: true },
    { key: 'districtMembers', label: 'जिल्ला कार्यसमिति', defaultShow: false },
    { key: 'regionalMembers', label: 'क्षेत्रीय सभापति', defaultShow: false },
    { key: 'unitMembers', label: 'इकाई सभापति', defaultShow: false },
    { key: 'provincialMembers', label: 'प्रदेश संयोजक', defaultShow: false },
    { key: 'centralMembers', label: 'केन्द्रीय सदस्य', defaultShow: false },
    { key: 'advisoryMembers', label: 'सलाहकार मण्डल', defaultShow: false },
  ];

  const sectionTitleMap = {
    members: 'title',
    districtMembers: 'districtTitle',
    regionalMembers: 'regionalTitle',
    unitMembers: 'unitTitle',
    provincialMembers: 'provincialTitle',
    centralMembers: 'centralMembersTitle',
    advisoryMembers: 'advisoryTitle',
  };

  useEffect(() => {
    loadCommitteeData();
  }, []);

  const loadCommitteeData = async () => {
    try {
      const { data } = await centralCommitteeAPI.getMembers();
      setCommitteeData(data);
      // Initialize showAll state
      const initialShow = {};
      sections.forEach(s => {
        initialShow[s.key] = s.defaultShow;
      });
      setShowAll(initialShow);
    } catch (error) {
      console.error('Failed to load committee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = (key) => {
    setShowAll({ ...showAll, [key]: !showAll[key] });
  };

  const getSectionTitle = (key) => {
    const titleKey = sectionTitleMap[key];
    return committeeData[titleKey] || sections.find(s => s.key === key)?.label || '';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.2)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"
        />
      </section>
    );
  }

  const renderMembers = (members, sectionKey) => {
    const displayMembers = showAll[sectionKey] ? members : members.slice(0, 8);
    const hasMore = members.length > 8;

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {displayMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <motion.img
                  src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo';
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-army text-base md:text-lg truncate">
                  {member.name}
                </h3>
                <p className="text-sm md:text-base text-gold-dark font-medium truncate">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {hasMore && (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(201, 162, 39, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleShow(sectionKey)}
              className="inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-all shadow-md hover:shadow-lg text-sm font-medium"
            >
              {showAll[sectionKey] ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View All ({members.length})
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.section
      className="py-20 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Title Section with Animation */}
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-army">
              {committeeData.title || 'केन्द्रीय कार्यसमिति'}
            </h1>
            <p className="text-gray-600 mt-4 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Meet our dedicated leadership team across all levels of the organization.
            </p>
            <motion.div
              className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          {/* Sections */}
          <AnimatePresence>
            {sections.map((section) => {
              const members = committeeData[section.key] || [];
              if (members.length === 0) return null;

              const title = getSectionTitle(section.key);

              return (
                <motion.div
                  key={section.key}
                  className="mb-14 last:mb-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <motion.div
                    className="flex items-center gap-3 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-army">
                      {title}
                    </h2>
                    <span className="text-sm md:text-base text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {members.length}
                    </span>
                  </motion.div>
                  {renderMembers(members, section.key)}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {sections.every(s => (committeeData[s.key] || []).length === 0) && (
            <motion.div
              className="text-center py-16 text-gray-500"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">No committee members available.</p>
            </motion.div>
          )}
        </div>
      </Container>
    </motion.section>
  );
};

export default CentralCommittee;
