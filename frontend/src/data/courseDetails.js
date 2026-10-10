// ─────────────────────────────────────────────────────────────
// Course detail page content.
// Transcribed from the reference designs in /images/*details.jpeg
// Keys MUST match the `id` of each course in COURSES_15 (CoursesGrid.jsx).
// Icon values are lucide-react component names (resolved in CourseDetailPage).
//
// `extras` is an ordered list of flexible blocks rendered after "Benefits":
//   { type: 'columns',    columns: [Column, Column] }
//   { type: 'elements',   title, subtitle?, items: [{ name, desc, icon }] }
//   { type: 'steps',      title, subtitle?, items: [{ title, text, icon }] }
//   { type: 'paragraphs', title, paragraphs: [] }
// Column = { title, subtitle?, paragraphs?, checklist?, numbered?, tools?, mukhis?, card? }
// ─────────────────────────────────────────────────────────────

export const COURSE_DETAILS = {
  /* ───────────────────────── MEDITATION ───────────────────────── */
  meditation: {
    eyebrow: ['Calm', 'Awareness', 'Well-being'],
    title: 'Meditation',
    tagline: 'A Path to Inner Peace',
    intro: 'Discover the power of meditation to reduce stress, improve well-being and live a more balanced life.',
    what: {
      title: 'What is Meditation?',
      icon: 'PersonStanding',
      text: 'Meditation is a simple yet powerful practice that helps calm the mind, reduce stress and bring greater peace and balance to life. It has been practiced for thousands of years and is now widely recognized for its positive impact on mental, emotional and physical well-being.'
    },
    use: {
      title: 'How Can I Use Meditation?',
      text: 'Meditation can be easily incorporated into everyday life. With regular practice, it helps you manage stress, stay focused and experience greater clarity and inner calm.',
      cta: 'Learn How Meditation Works',
      items: [
        { label: 'Stress Reduction', icon: 'Flower2' },
        { label: 'Mental Clarity', icon: 'Heart' },
        { label: 'Everyday Well-being', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'Meditation Philosophy',
      text: 'Meditation helps quiet the mind and brings you into the present moment. It allows you to experience a state of thoughtless awareness, where stress is reduced without losing alertness or effectiveness.'
    },
    benefits: {
      title: 'Benefits of Meditation',
      subtitle: 'Meditation supports overall well-being and can bring positive changes to many areas of life.',
      items: [
        { label: 'Reduces Stress', icon: 'Flower2' },
        { label: 'Improves Mental Health', icon: 'Brain' },
        { label: 'Increases Focus & Awareness', icon: 'Target' },
        { label: 'Enhances Quality of Life', icon: 'Moon' },
        { label: 'Supports Emotional Balance', icon: 'Heart' },
        { label: 'Promotes Physical Well-being', icon: 'Leaf' },
        { label: 'May Reduce Healthcare Visits', icon: 'Users' },
        { label: 'Brings Inner Peace & Happiness', icon: 'Sun' }
      ]
    },
    extras: [
      {
        type: 'columns',
        heading: 'Growing Importance',
        columns: [
          {
            numbered: [
              'Helps reduce daily stress and tension',
              'Cultivates inner calm and emotional balance',
              'Encourages a healthier, more peaceful life'
            ]
          },
          {
            numbered: [
              'Supports better quality of life',
              'Connected with mind\u2013body well-being',
              'May help reduce healthcare costs'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Meditation Journey',
      text: 'Learn simple and effective meditation techniques and experience a calmer, healthier and more balanced you.'
    }
  },

  /* ───────────────────────── REIKI ───────────────────────── */
  reiki: {
    eyebrow: ['Energy', 'Healing', 'Transformation'],
    title: 'Reiki',
    tagline: 'Channel Divine Healing Energy',
    intro: 'Discover the sacred Japanese art of hands-on healing to harmonize energy centers, dissolve physical and emotional blocks, and awaken your innate healing power.',
    what: {
      title: 'What is Reiki?',
      icon: 'Sparkles',
      text: 'Reiki is an ancient Japanese energy healing practice founded by Dr. Mikao Usui. "Rei" means universal spiritual wisdom, and "Ki" means life force energy. By channeling this universal life force through gentle touch and sacred symbols, Reiki restores balance to the body, mind, and spirit.'
    },
    use: {
      title: 'How Can I Use Reiki?',
      text: 'Reiki can be easily integrated into daily life for self-healing, balancing family members, pets, plants, and clearing the energetic atmosphere of homes and workspaces.',
      cta: 'Learn How Reiki Works',
      items: [
        { label: 'Self-Healing', icon: 'Flower2' },
        { label: 'Treating Others', icon: 'Heart' },
        { label: 'Chakra Balancing', icon: 'Layers' },
        { label: 'Distance Healing', icon: 'Sparkles' }
      ]
    },
    philosophy: {
      title: 'Reiki Philosophy & The Five Principles',
      text: 'Reiki is guided by universal love and five sacred principles: Just for today, do not be angry; do not worry; be grateful; work with diligence; be kind to all living beings. It flows intelligently to where it is needed most to support natural healing.'
    },
    benefits: {
      title: 'Benefits of Reiki',
      subtitle: 'Reiki provides deep holistic healing across physical, mental, emotional, and spiritual levels.',
      items: [
        { label: 'Relieves Stress & Anxiety', icon: 'Flower2' },
        { label: 'Chakra & Energy Balancing', icon: 'Layers' },
        { label: 'Deep Relaxation & Restful Sleep', icon: 'Moon' },
        { label: 'Accelerates Natural Recovery', icon: 'Heart' },
        { label: 'Cleanses Negative Emotions', icon: 'Leaf' },
        { label: 'Enhances Mental Focus', icon: 'Brain' },
        { label: 'Strengthens Immune Vitality', icon: 'Shield' },
        { label: 'Spiritual Awakening & Peace', icon: 'Sun' }
      ]
    },
    extras: [
      {
        type: 'steps',
        title: 'Levels of Sacred Reiki Training',
        subtitle: 'Our authentic Usui Reiki lineage offers systematic initiation and hands-on attunements:',
        items: [
          {
            title: 'First Degree (Shoden)',
            icon: 'Hand',
            text: 'Learn foundational hand positions, self-treatment protocols, clearing auric fields, and receive your Level 1 sacred attunement to channel universal life force.'
          },
          {
            title: 'Second Degree (Okuden)',
            icon: 'Sparkles',
            text: 'Master the sacred Reiki symbols (Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen) for mental/emotional cleansing, habit transformation, and distant healing across time and space.'
          },
          {
            title: 'Master & Teacher (Shinpiden)',
            icon: 'Sun',
            text: 'Receive the Master attunement and Dai Ko Myo symbol. Learn the sacred attunement processes to initiate and empower new Reiki healers and practitioners.'
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Reiki Journey',
      text: 'Step into the lineage of authentic Usui Reiki and awaken the healer within with lifetime guidance and master attunements.'
    }
  },

  /* ───────────────────────── VAASTU ───────────────────────── */
  vaastu: {
    eyebrow: ['Harmony', 'Prosperity', 'Well-being'],
    title: 'Vaastu',
    tagline: 'Ancient Wisdom for Balanced Spaces',
    intro: 'Create harmonious living and working spaces for a healthier, happier and more prosperous life.',
    what: {
      title: 'What is Vaastu?',
      icon: 'Home',
      text: 'Vaastu is an ancient Indian science of architecture and buildings that helps in creating harmonious spaces by aligning with nature, its elements and energy fields. It combines the science, art, astronomy and traditional knowledge to support health, prosperity, happiness and overall well-being.'
    },
    use: {
      title: 'How Can I Use Vaastu?',
      text: 'Vaastu principles can be applied while designing, constructing or arranging homes, workplaces and other spaces. By understanding directions, natural elements and spatial balance, you can create a more positive and supportive environment.',
      items: [
        { label: 'Homes & Residences', icon: 'Home' },
        { label: 'Offices & Workplaces', icon: 'Building2' },
        { label: 'Better Environment', icon: 'Leaf' },
        { label: 'Growth & Prosperity', icon: 'TrendingUp' }
      ]
    },
    philosophy: {
      title: 'Vaastu Philosophy',
      text: 'Vaastu is based on the relationship between people, spaces and nature. It is guided by the five elements of nature \u2014 Earth, Water, Fire, Air and Space (Paanchbhootas) \u2014 and the balance of directions and natural influences.'
    },
    benefits: {
      title: 'Benefits of Vaastu',
      subtitle: 'Vaastu helps create spaces that support a more balanced and positive life.',
      items: [
        { label: 'Harmonious Spaces', icon: 'Flower2' },
        { label: 'Better Well-being', icon: 'Heart' },
        { label: 'Positive Environment', icon: 'Leaf' },
        { label: 'Prosperity & Abundance', icon: 'Coins' },
        { label: 'Natural Energy Flow', icon: 'Sun' },
        { label: 'Directional Balance', icon: 'Compass' },
        { label: 'Element Harmony', icon: 'Atom' },
        { label: 'Peace & Happiness', icon: 'Flower2' }
      ]
    },
    extras: [
      {
        type: 'elements',
        title: 'The Five Elements (Paanchbhootas)',
        items: [
          { name: 'Earth', desc: 'Stability & Grounding', icon: 'Mountain' },
          { name: 'Water', desc: 'Flow & Nourishment', icon: 'Droplet' },
          { name: 'Fire', desc: 'Energy & Transformation', icon: 'Flame' },
          { name: 'Air', desc: 'Movement & Circulation', icon: 'Wind' },
          { name: 'Space', desc: 'Openness & Expansion', icon: 'Orbit' }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Vaastu Journey',
      text: 'Learn practical Vaastu principles and create spaces that bring harmony, prosperity and positive energy.'
    }
  },

  /* ───────────────────────── FENG SHUI ───────────────────────── */
  'feng-shui': {
    eyebrow: ['Harmony', 'Balance', 'Positive Energy'],
    title: 'Feng Shui',
    tagline: 'The Art of Harmonious Living',
    intro: 'Create balanced spaces by aligning with natural energies to attract peace, prosperity and well-being.',
    what: {
      title: 'What is Feng Shui?',
      icon: 'Home',
      text: 'Feng Shui is an ancient Chinese art of arranging buildings, objects and spaces to create harmony and balance. It means \u201cthe way of wind and water\u201d and is based on the flow of life energy (chi) to bring peace, prosperity and well-being.'
    },
    use: {
      title: 'How Can I Use Feng Shui?',
      text: 'Feng Shui principles can be applied in homes, offices and other spaces by arranging furniture, objects and elements to improve the flow of positive energy (chi) and create a supportive environment.',
      cta: 'Learn How Feng Shui Works',
      items: [
        { label: 'Homes & Residences', icon: 'Home' },
        { label: 'Offices & Workspaces', icon: 'Briefcase' },
        { label: 'Better Environment', icon: 'Leaf' },
        { label: 'Prosperity & Growth', icon: 'TrendingUp' }
      ]
    },
    philosophy: {
      title: 'Feng Shui Philosophy',
      text: 'Feng Shui is based on the balance of yin and yang and the flow of chi (life force energy) in our surroundings. By creating harmony between people and their environment, it aims to support health, happiness and prosperity.'
    },
    benefits: {
      title: 'Benefits of Feng Shui',
      subtitle: 'Feng Shui helps create spaces that support a more balanced and positive life.',
      items: [
        { label: 'Harmonious Spaces', icon: 'Flower2' },
        { label: 'Better Relationships', icon: 'Heart' },
        { label: 'Attracts Prosperity', icon: 'Coins' },
        { label: 'Positive Energy Flow', icon: 'Leaf' },
        { label: 'Health & Well-being', icon: 'PersonStanding' },
        { label: 'Enhanced Focus & Productivity', icon: 'Sun' },
        { label: 'Balance of Yin and Yang', icon: 'Shield' },
        { label: 'Peace & Happiness', icon: 'Sparkles' }
      ]
    },
    extras: [
      {
        type: 'elements',
        title: 'The Five Elements',
        subtitle: 'Feng Shui works with the five elements of nature. Balancing these elements helps maintain positive energy in a space.',
        items: [
          { name: 'Wood', desc: 'Growth & Vitality', icon: 'TreeDeciduous' },
          { name: 'Water', desc: 'Flow & Abundance', icon: 'Droplet' },
          { name: 'Fire', desc: 'Energy & Transformation', icon: 'Flame' },
          { name: 'Earth', desc: 'Stability & Support', icon: 'Mountain' },
          { name: 'Metal', desc: 'Clarity & Protection', icon: 'CircleDot' }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Feng Shui Journey',
      text: 'Learn practical Feng Shui techniques and create spaces that bring harmony, balance and positive energy.'
    }
  },

  /* ───────────────────────── DOWSING ───────────────────────── */
  dowsing: {
    eyebrow: ['Intuition', 'Energy', 'Guidance'],
    title: 'Dowsing',
    tagline: 'Connect with Subtle Energies',
    intro: 'Learn the ancient art of dowsing to receive intuitive guidance and explore the unseen energies around you.',
    what: {
      title: 'What is Dowsing?',
      icon: 'Gem',
      text: 'Dowsing is the practice of using tools, the body or intuition to obtain information beyond the ordinary physical senses. It is a form of divination that helps perceive hidden information and subtle energies from the subconscious mind.'
    },
    use: {
      title: 'How Can I Use Dowsing?',
      text: 'Dowsing can be used to find hidden things, understand subtle energies and receive intuitive guidance. It is often used for locating water, metals, leylines and earth energies, and for making informed decisions in daily life.',
      cta: 'Learn How Dowsing Works',
      items: [
        { label: 'Find Hidden Things', icon: 'Droplet' },
        { label: 'Geopathic Energies', icon: 'Mountain' },
        { label: 'Decision Support', icon: 'Compass' },
        { label: 'Spiritual Guidance', icon: 'Flower2' }
      ]
    },
    philosophy: {
      title: 'Dowsing Philosophy',
      text: 'Dowsing is based on the understanding that subtle energies exist beyond our physical senses. By using tools, the body or intuition, we can access this information and connect with the natural energies around us.'
    },
    benefits: {
      title: 'Benefits of Dowsing',
      subtitle: 'Dowsing supports personal growth and helps you become more aware of your surroundings.',
      items: [
        { label: 'Discover Hidden Information', icon: 'Search' },
        { label: 'Understand Energy Patterns', icon: 'Leaf' },
        { label: 'Supports Better Decisions', icon: 'Sun' },
        { label: 'Enhances Intuition', icon: 'Flower2' },
        { label: 'Useful for Various Applications', icon: 'Mountain' },
        { label: 'Personal & Spiritual Growth', icon: 'Users' },
        { label: 'Increases Awareness', icon: 'Target' },
        { label: 'Brings Clarity & Confidence', icon: 'Heart' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'Tools and Methods',
            subtitle: 'Dowsing can be practiced with different tools or even without tools, using the body and intuition.',
            tools: [
              { label: 'Pendulum', icon: 'Gem' },
              { label: 'Lecher Antenna / Biotensor', icon: 'Radio' },
              { label: 'Muscle Testing (Body Dowsing)', icon: 'PersonStanding' },
              { label: 'Intuition (Inner Senses)', icon: 'Brain' }
            ]
          },
          {
            title: 'Common Applications',
            subtitle: 'Dowsing is widely used in many areas of life to discover subtle energies and provide guidance.',
            tools: [
              { label: 'Locating Resources', icon: 'Droplet' },
              { label: 'Earth & Leylines', icon: 'Mountain' },
              { label: 'Space Assessment', icon: 'Home' },
              { label: 'Intuitive Guidance', icon: 'Sparkles' }
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Dowsing Journey',
      text: 'Learn practical dowsing techniques and develop your intuition to connect with subtle energies around you.'
    }
  },

  /* ───────────────────────── LAMA FERA ───────────────────────── */
  'lama-fera': {
    eyebrow: ['Heal', 'Transform', 'Awaken'],
    title: 'Lama Fera',
    tagline: 'Ancient Buddhist Healing Technique',
    intro: 'Experience the powerful healing energy of Lama Fera for inner peace, protection and overall well-being.',
    what: {
      title: 'What is Lama Fera?',
      icon: 'Flower2',
      text: 'Lama Fera is the world\u2019s fastest healing technique used by Buddhist Monks in ancient times. \u2018Lama\u2019 means a Sadguru, an enlightened guru, and \u2018Fera\u2019 means the technique of healing. This system helps in physical, emotional, mental and spiritual healing and supports overall well-being.'
    },
    use: {
      title: 'How Can I Use Lama Fera?',
      text: 'Lama Fera can be used for self-healing, healing others, meditation enhancement, energy cleansing and spiritual growth. It is a safe, simple and powerful technique that can be applied in daily life.',
      items: [
        { label: 'Self Healing', icon: 'Flower2' },
        { label: 'Heal Others', icon: 'Heart' },
        { label: 'Energy Cleansing', icon: 'Shield' },
        { label: 'Any Situation', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'Lama Fera Philosophy',
      text: 'Lama Fera is a Buddhist healing technique that involves calling upon Lord Buddha\u2019s healing energy. It works through divine symbols, meditation and attunement to channel high-frequency energy for healing, protection and spiritual transformation.'
    },
    benefits: {
      title: 'Benefits of Lama Fera',
      subtitle: 'Lama Fera offers many benefits for overall well-being and spiritual growth.',
      items: [
        { label: 'Relieves pain and discomfort', icon: 'Flower2' },
        { label: 'Reduces fear, anxiety and stress', icon: 'Brain' },
        { label: 'Improves meditation, memory and visualization', icon: 'TrendingUp' },
        { label: 'Removes negative energies and unwanted spirits', icon: 'Shield' },
        { label: 'Supports healing in chronic conditions', icon: 'Heart' },
        { label: 'Cleanses spaces and environments', icon: 'Leaf' },
        { label: 'Increases spiritual abilities', icon: 'Star' },
        { label: 'Helps reconnect with the Higher Self', icon: 'Users' }
      ]
    },
    extras: [
      {
        type: 'columns',
        heading: 'Lama Fera Master ',
        columns: [
          {
            paragraphs: [
              'A Lama Fera Master heals, guides, and teaches this powerful technique by channeling divine golden light through the blessings of Lord Buddha to support healing and transformation.'
            ]
          },
          {
            paragraphs: [
              'Through meditation and connection with Lord Buddha, you receive Master Teacher attunement, sacred symbols, a manual, certificate, and ongoing support to practice and teach Lama Fera healing.'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Lama Fera Journey',
      text: 'Learn this powerful Buddhist healing technique and experience inner peace, protection and transformation.'
    }
  },

  /* ───────────────────────── ACUPRESSURE ───────────────────────── */
  accupressure: {
    eyebrow: ['Natural Healing', 'Balance', 'Vitality'],
    title: 'Acupressure',
    tagline: 'Healing Touch for a Healthier Life',
    intro: 'Discover the power of acupressure \u2014 an ancient healing art that stimulates the body\u2019s natural self-curative abilities and supports overall well-being.',
    what: {
      title: 'What is Acupressure?',
      icon: 'Hand',
      text: 'Acupressure is an ancient healing art that uses finger pressure on specific points to stimulate the body\u2019s natural healing abilities. Developed in Asia over 5,000 years ago, it is a safe and effective technique for promoting physical, mental and emotional well-being.'
    },
    use: {
      title: 'How Can I Use Acupressure?',
      text: 'Acupressure can be easily incorporated into daily life. By applying gentle to firm pressure on key points, you can relieve stress, reduce pain, improve circulation and support preventive health care.',
      cta: 'Learn How Acupressure Works',
      items: [
        { label: 'Self Care', icon: 'Flower2' },
        { label: 'Stress Relief', icon: 'Heart' },
        { label: 'Pain Management', icon: 'Shield' },
        { label: 'Better Immunity', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'Healing Energy Work',
      text: 'Acupressure points have high electrical conductivity and help channel the body\u2019s natural healing energy (Qi/Chi). By stimulating these points, energy flow through the meridians is improved, which supports the body\u2019s systems and overall well-being.'
    },
    benefits: {
      title: 'Benefits of Acupressure',
      subtitle: 'Acupressure offers many benefits for the body, mind and emotions.',
      items: [
        { label: 'Relieves Stress & Tension', icon: 'Flower2' },
        { label: 'Reduces Pain', icon: 'Heart' },
        { label: 'Improves Circulation', icon: 'TrendingUp' },
        { label: 'Boosts Immunity', icon: 'Shield' },
        { label: 'Supports Emotional Well-being', icon: 'PersonStanding' },
        { label: 'Helps in Detoxification', icon: 'Leaf' },
        { label: 'Enhances Vitality & Energy', icon: 'Sun' },
        { label: 'Supports Overall Health', icon: 'Users' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'Key Applications',
            checklist: [
              'Stress & Tension Relief',
              'Emotional Balance & Anxiety',
              'Body Detoxification',
              'Immunity & Vitality Boost'
            ]
          },
          {
            title: 'Topics Covered in the Course',
            numbered: [
              'History & Philosophy',
              'Point Pressure Techniques',
              'Pain, Cold & Flu Relief',
              'Safety & Best Practices'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Acupressure Journey',
      text: 'Learn simple and effective acupressure techniques for a healthier, more balanced life.'
    }
  },

  /* ───────────────────────── CRYSTAL THERAPY ───────────────────────── */
  'crystal-therapy': {
    eyebrow: ['Balance', 'Heal', 'Energize', 'Transform'],
    title: 'Crystal Therapy',
    tagline: 'Harness the Healing Energy of Crystals',
    intro: 'Discover the gentle power of crystals to support physical, emotional, mental and spiritual well-being.',
    what: {
      title: 'What is Crystal Therapy?',
      icon: 'Gem',
      text: 'Crystal therapy is an ancient healing system that uses the precise placement of crystals on the body and in the surrounding environment to promote balance and well-being. It addresses the whole person \u2014 physical, emotional, mental and spiritual \u2014 rather than focusing on just one symptom.'
    },
    use: {
      title: 'How Can I Use Crystal Therapy?',
      text: 'Crystal therapy can be incorporated into daily life through crystal placement, meditation, energy work and creating a harmonious space. It is a non-invasive, natural and supportive practice that helps you relax, re-energize and feel more balanced.',
      cta: 'Learn How Crystal Therapy Works',
      items: [
        { label: 'Personal Healing', icon: 'Flower2' },
        { label: 'Meditation Support', icon: 'PersonStanding' },
        { label: 'Home Energy Balance', icon: 'Home' },
        { label: 'Everyday Well-being', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'Crystal Therapy Philosophy',
      text: 'Crystals are believed to hold natural energies that can help bring harmony to the body, mind and environment. By working with these energies, crystal therapy aims to support healing, inner peace and a more balanced life.'
    },
    benefits: {
      title: 'Benefits of Crystal Therapy',
      subtitle: 'Crystal therapy can support overall well-being and bring positive changes in many areas of life.',
      items: [
        { label: 'Promotes Relaxation', icon: 'Flower2' },
        { label: 'Reduces Stress & Anxiety', icon: 'Heart' },
        { label: 'Supports Emotional Balance', icon: 'Leaf' },
        { label: 'Enhances Positive Energy', icon: 'Sun' },
        { label: 'Supports Spiritual Growth', icon: 'PersonStanding' },
        { label: 'Strengthens Overall Well-being', icon: 'Shield' },
        { label: 'Brings Harmony', icon: 'Sparkles' },
        { label: 'Complements Daily Life', icon: 'TrendingUp' }
      ]
    },
    extras: [
      {
        type: 'columns',
        heading: 'A Gentle & Natural Approach',
        columns: [
          {
            checklist: [
              'Centuries-old tradition of crystal energy',
              'Promotes inner peace, deep calm & harmony',
              'Nurtures self-awareness and mindful living',
              'Gentle support for overall vitality'
            ]
          },
          {
            checklist: [
              'Ancient healing tradition with a rich history',
              'A holistic approach for body, mind and spirit',
              'A relaxing and non-invasive practice',
              'Helps create a harmonious and positive environment'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Crystal Therapy Journey',
      text: 'Learn how crystals can support your healing, bring balance and add more positivity to your life.'
    }
  },

  /* ───────────────────────── PYRAMID ───────────────────────── */
  pyramid: {
    eyebrow: ['Prosperity', 'Balance', 'Positive Energy'],
    title: 'Pyramid',
    tagline: 'A Simple Tool for a Harmonious Life',
    intro: 'Discover the power of Vastu pyramids and how they can bring prosperity, stability and positive energy to your home and workspace.',
    what: {
      title: 'What is a Pyramid?',
      icon: 'Triangle',
      text: 'A pyramid, as per Vastu Shastra, is a powerful tool that helps harness natural energy and create a balanced environment. Even small pyramids can have a positive impact on your life by attracting prosperity, harmony and well-being.'
    },
    use: {
      title: 'How Can I Use a Pyramid?',
      text: 'Placing a pyramid in the right location can enhance positive energy, improve financial stability and bring harmony to your home or workspace. It works best when kept in the place where you spend most of your time.',
      cta: 'Learn How Pyramids Work',
      items: [
        { label: 'Homes & Living Spaces', icon: 'Home' },
        { label: 'Offices & Workspaces', icon: 'Briefcase' },
        { label: 'Wealth & Prosperity', icon: 'TrendingUp' },
        { label: 'Positive Energy', icon: 'Flower2' }
      ]
    },
    philosophy: {
      title: 'Pyramid in Vastu Philosophy',
      text: 'According to Vastu Shastra, pyramids help in balancing energies in the environment. They are believed to enhance prosperity, maintain stability and create a harmonious atmosphere for a better and more peaceful life.'
    },
    benefits: {
      title: 'Benefits of Pyramid',
      subtitle: 'A pyramid can support various aspects of your life and create a more positive environment.',
      items: [
        { label: 'Increases Prosperity', icon: 'Coins' },
        { label: 'Maintains Stability', icon: 'Shield' },
        { label: 'Balances Energy', icon: 'Flower2' },
        { label: 'Brings Peace & Harmony', icon: 'Heart' },
        { label: 'Supports Family Well-being', icon: 'Users' },
        { label: 'Creates a Positive Environment', icon: 'Sun' },
        { label: 'Enhances Focus & Clarity', icon: 'Leaf' },
        { label: 'Supports Overall Growth', icon: 'TrendingUp' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'Pyramid for Home Vastu',
            paragraphs: [
              'According to Vastu Shastra, placing a pyramid in the home, especially in the kitchen or frequently used spaces, is believed to attract prosperity, increase income, and bring family stability.'
            ]
          },
          {
            title: 'Types of Pyramid in Vastu',
            paragraphs: [
              'Vastu pyramids come in various types, each serving different purposes. Consult a Vastu expert to choose the right pyramid and placement for maximum benefits.'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Pyramid Journey',
      text: 'Learn how a simple pyramid can bring prosperity, balance and positive energy to your life.'
    }
  },

  /* ───────────────────────── NUMEROLOGY ───────────────────────── */
  numerology: {
    eyebrow: ['Numbers', 'Guidance', 'Purpose', 'Harmony'],
    title: 'Numerology',
    tagline: 'Decode the Numbers, Discover Your Path',
    intro: 'Explore the ancient science of numerology and learn how numbers can reveal your personality, strengths, life purpose and best opportunities.',
    what: {
      title: 'What is Numerology?',
      icon: 'Hash',
      text: 'Numerology is the study of numbers and the subtle way they reflect certain aptitudes and character tendencies as part of the cosmic plan. Each letter has a numeric value that creates a unique vibration, and the numbers in your birth date and name reveal important insights about your personality, life purpose and natural talents.'
    },
    use: {
      title: 'How Can I Use Numerology?',
      text: 'Numerology can guide you in understanding yourself better and help you make more informed decisions in life. It can be used to identify strengths, choose the right time for important activities and gain clarity about your personal and professional path.',
      cta: 'Learn How Numerology Works',
      items: [
        { label: 'Self Understanding', icon: 'PersonStanding' },
        { label: 'Life Purpose', icon: 'Target' },
        { label: 'Better Decision Making', icon: 'TrendingUp' },
        { label: 'Personal & Professional Growth', icon: 'Heart' }
      ]
    },
    philosophy: {
      title: 'Numerology Philosophy',
      text: 'Numbers are believed to carry unique vibrations that influence our thoughts, behaviour and life experiences. By decoding the vibrations in your birth date and name, numerology helps you understand your natural tendencies and align with your true path.'
    },
    benefits: {
      title: 'Benefits of Numerology',
      subtitle: 'Numerology can bring valuable insights and positive changes in many areas of life.',
      items: [
        { label: 'Discover Your Strengths', icon: 'Lightbulb' },
        { label: 'Understand Your Purpose', icon: 'Flower2' },
        { label: 'Guidance for Major Life Decisions', icon: 'Compass' },
        { label: 'Improve Relationships', icon: 'Heart' },
        { label: 'Identify Best Timing ', icon: 'TrendingUp' },
        { label: 'Build Confidence', icon: 'Shield' },
        { label: 'Recognize Hidden Talents', icon: 'Sparkles' },
        { label: 'Bring More Balance & Harmony', icon: 'Users' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'How Does Numerology Work?',
            paragraphs: [
              'Your name and birth date hold unique numerical values believed to reveal your personality, motivations, and life path through cosmic vibrations and energies.'
            ]
          },
          {
            title: 'The Father of Modern Numerology',
            paragraphs: [
              'Pythagoras is regarded as the father of modern numerology, which has ancient roots and gained popularity through the works of L. Dow Balliett and Florence Campbell.'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Numerology Journey',
      text: 'Learn how numbers can guide you towards a more fulfilled, balanced and purposeful life.'
    }
  },

  /* ───────────────────────── ASTROLOGY ───────────────────────── */
  astrology: {
    eyebrow: ['Guidance', 'Harmony', 'Self Discovery'],
    title: 'Astrology',
    tagline: 'Explore the Cosmic Blueprint of Your Life',
    intro: 'Discover the wisdom of the stars and planets to gain clarity, understand your life path and align with your true potential.',
    what: {
      title: 'What is Astrology?',
      icon: 'Moon',
      text: 'Astrology is the study of patterns and relationships \u2013 of planets in motion, our birth chart, synastry with others, the elements and more \u2013 using this ancient knowledge as a tool to find meaning, gain clarity and understand our life path.'
    },
    use: {
      title: 'How Can I Use Astrology?',
      text: 'Astrology can help you understand your personality, strengths, challenges and potential. By studying the positions of the planets at the time of your birth, it provides guidance for important decisions and a deeper understanding of your life\u2019s journey.',
      cta: 'Learn How Astrology Works',
      items: [
        { label: 'Self Awareness', icon: 'Flower2' },
        { label: 'Better Decision Making', icon: 'Target' },
        { label: 'Life Guidance', icon: 'Scale' },
        { label: 'Improved Relationships', icon: 'Heart' }
      ]
    },
    philosophy: {
      title: 'Astrology Philosophy',
      text: 'The stars and planets are believed to influence our experiences through intricate patterns and relationships. Astrology helps us understand these cosmic influences and find meaning in our journey, supporting personal growth and alignment with our true self.'
    },
    benefits: {
      title: 'Benefits of Astrology',
      subtitle: 'Astrology can bring valuable insights and positive changes in many areas of life.',
      items: [
        { label: 'Better Self Understanding', icon: 'Users' },
        { label: 'Clarity in Life\u2019s Purpose', icon: 'Compass' },
        { label: 'Guidance for Major Life Decisions', icon: 'TrendingUp' },
        { label: 'Stronger Relationships', icon: 'Heart' },
        { label: 'Recognize Strengths & Talents', icon: 'Flower2' },
        { label: 'Emotional Balance', icon: 'PersonStanding' },
        { label: 'Positive Mindset', icon: 'Sun' },
        { label: 'Alignment with Life Path', icon: 'Leaf' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'How Does Astrology Work?',
            paragraphs: [
              'Astrologers analyze planetary positions, zodiac signs, houses, and angles at birth to understand a person’s personality, life, and future possibilities.'
            ]
          },
          {
            title: 'Different Forms of Astrology',
            paragraphs: [
              'Astrology has no single unified theory, with different traditions evolving across cultures, including Western, Chinese, Vedic, and Tibetan astrology.'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Astrology Journey',
      text: 'Discover how the wisdom of the stars can guide you towards a more fulfilling and balanced life.'
    }
  },

  /* ───────────────────────── RUDRAKSHA ───────────────────────── */
  rudraksha: {
    eyebrow: ['Spirituality', 'Protection', 'Positive Energy'],
    title: 'Rudraksha',
    tagline: 'A Divine Seed for a Balanced Life',
    intro: 'Experience the powerful energy of Rudraksha, a sacred seed that creates positive vibrations and supports your spiritual, mental and physical well-being.',
    what: {
      title: 'What is Rudraksha?',
      icon: 'CircleDot',
      text: 'Rudraksha is a sacred seed that creates unique vibrations and positive energy. The name Rudraksha comes from two words \u2014 Rudra (Lord Shiva) and Aksha (tears). It is believed that the seeds were formed from the tears of Lord Shiva, who was in a deep meditative state for the well-being of all beings.'
    },
    use: {
      title: 'How Can Rudraksha Help?',
      text: 'Rudraksha generates positive vibrations that can support your spiritual growth, mental peace, emotional balance and overall well-being. Each Rudraksha is associated with a specific planet, deity and energy frequency.',
      cta: 'Learn How Rudraksha Works',
      items: [
        { label: 'Spiritual Growth', icon: 'Flower2' },
        { label: 'Mental Peace', icon: 'PersonStanding' },
        { label: 'Protection from Negativity', icon: 'Shield' },
        { label: 'Emotional Balance', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'The Divine Origin',
      text: 'It is said that Lord Shiva, in a deep transcendental meditative state, shed tears of ecstasy for the well-being of all creatures. These tears fell on earth and became the seeds of the Rudraksha trees.'
    },
    benefits: {
      title: 'Benefits of Rudraksha',
      subtitle: 'Rudraksha can bring positive changes in many aspects of your life.',
      items: [
        { label: 'Enhances Spiritual Connection', icon: 'Flower2' },
        { label: 'Brings Inner Peace', icon: 'Heart' },
        { label: 'Improves Focus & Clarity', icon: 'Brain' },
        { label: 'Provides Protection', icon: 'Shield' },
        { label: 'Supports Planetary Balance', icon: 'TrendingUp' },
        { label: 'Reduces Stress & Anxiety', icon: 'Leaf' },
        { label: 'Boosts Positive Energy', icon: 'Sun' },
        { label: 'Promotes Overall Well-being', icon: 'Users' }
      ]
    },
    extras: [
      {
        type: 'columns',
        columns: [
          {
            title: 'Types of Rudraksha',
            paragraphs: [
              'Rudraksha seeds are of different varieties, depending on the number of faces or clefts (Mukhis) they have. Rudraksha ranging from 1 Mukhi to 14 Mukhi are commonly known, each with a unique energy, ruling planet, deity and Beej mantra.'
            ]
          },
          {
            title: 'Scientific & Natural Origin',
            paragraphs: [
              'The scientific name of the Rudraksha tree is Elaeocarpus ganitrus roxb. These trees mainly grow in the Himalayan region, and also in Indonesia, Southeast Asia, Nepal, New Guinea and Hawaii. Interestingly, 35 out of 300 species of this plant are found in India itself.'
            ]
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Rudraksha Journey',
      text: 'Invite positive energy, balance and spiritual growth into your life with the power of Rudraksha.'
    }
  },

  /* ───────────────────────── PRANIC HEALING ───────────────────────── */
  'pranic-healing': {
    eyebrow: ['Cleanse', 'Energize', 'Heal', 'Balance'],
    title: 'Pranic Healing',
    tagline: 'Activate Your Natural Healing Energy',
    intro: 'A powerful no-touch healing system that uses life force energy (prana) to accelerate the body\u2019s innate ability to heal itself and bring balance to the body, mind and spirit.',
    what: {
      title: 'What is Pranic Healing?',
      icon: 'HandHeart',
      text: 'Pranic Healing is an energy \u201cno-touch\u201d healing system based on the fundamental principle that the body has the innate ability to heal itself. It utilizes \u201clife force,\u201d \u201cenergy,\u201d or prana to accelerate the body\u2019s inborn ability to heal itself. It is practiced by hundreds of thousands across the world.'
    },
    use: {
      title: 'How Can Pranic Healing Help?',
      text: 'Thousands of miraculous healing stories have been documented with the use of Pranic Healing, including the full spectrum of physical and psychological conditions such as headaches, flu, ulcers, back pain, asthma, migraines, mental illness, multiple sclerosis, cancer and much more.',
      cta: 'Learn How Pranic Healing Works',
      items: [
        { label: 'Physical Healing', icon: 'Flower2' },
        { label: 'Mental & Emotional Balance', icon: 'Brain' },
        { label: 'Energy Cleansing', icon: 'Sparkles' },
        { label: 'Spiritual Growth', icon: 'PersonStanding' }
      ]
    },
    philosophy: {
      title: 'Pranic Healing Philosophy',
      text: 'The body has an innate ability to heal itself. Pranic Healing works by cleansing, energizing and balancing the body\u2019s energy field, removing stagnant and diseased energy and replenishing it with fresh prana (life force energy) to accelerate the natural healing process.'
    },
    benefits: {
      title: 'Benefits of Pranic Healing',
      subtitle: 'Pranic Healing can bring positive changes in many aspects of your life.',
      items: [
        { label: 'Supports Physical Healing', icon: 'Heart' },
        { label: 'Reduces Stress & Anxiety', icon: 'Flower2' },
        { label: 'Boosts Immunity', icon: 'Shield' },
        { label: 'Improves Energy Levels', icon: 'Leaf' },
        { label: 'Enhances Mental Clarity', icon: 'Brain' },
        { label: 'Brings Emotional Balance', icon: 'PersonStanding' },
        { label: 'Promotes Spiritual Growth', icon: 'Sparkles' },
        { label: 'Supports Overall Well-being', icon: 'Users' }
      ]
    },
    extras: [
      {
        type: 'steps',
        title: 'Different Levels of Pranic Healing System',
        subtitle: 'There are 4 distinct levels of the pranic healing system. These include:',
        items: [
          {
            title: 'Basic Pranic Healing',
            text: 'Learners practice channeling chi energy, scanning and cleansing the energy body, stabilizing energy, preventing energy contamination, and supporting the healing process.'
          },
          {
            title: 'Advanced Pranic Healing',
            text: 'This level teaches the learners to purify and invigorate the patients\u2019 bodies by making perfect use of even more influential \u2018color pranas\u2019.'
          },
          {
            title: 'Pranic Psychotherapy',
            text: 'As the name suggests, this level revolves around the use of crystals for focusing \u2018prana\u2019 to patients in a stronger manner.'
          }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Pranic Healing Journey',
      text: 'Discover the transformative power of prana and bring balance, health and harmony into your life.'
    }
  },

  /* ───────────────────────── GEMS WITH REIKI ───────────────────────── */
  'gems-with-reiki': {
    eyebrow: ['Heal', 'Balance', 'Energize', 'Transform'],
    title: 'Gems with Reiki',
    tagline: 'The Synergy of Crystals and Reiki Energy',
    intro: 'Crystals carry unique natural vibrations, and when combined with Reiki, they amplify the healing energy to release deeper emotional, mental and spiritual blocks, bringing balance and harmony to your life.',
    what: {
      title: 'What are Reiki Crystals?',
      icon: 'Gem',
      text: 'Crystals are natural energy tools that carry unique vibrations. A Reiki practitioner may use crystals during your Reiki session to add an extra element of healing by helping to release emotional, mental or spiritual blocks. Crystals may be placed on or around your body, or you may be asked to hold a crystal.'
    },
    use: {
      title: 'How Do Crystals Enhance Reiki?',
      text: 'Some practitioners have discovered that there are stronger Reiki effects when using crystals in their healings. The natural vibrations of crystals work in synergy with Reiki energy to clear blockages, balance your energy centers and deepen the healing experience.',
      cta: 'Learn More About Crystals with Reiki',
      items: [
        { label: 'Amplifies Healing Energy', icon: 'Flower2' },
        { label: 'Releases Emotional Blocks', icon: 'Brain' },
        { label: 'Balances Chakras', icon: 'Layers' },
        { label: 'Supports Spiritual Growth', icon: 'Leaf' }
      ]
    },
    philosophy: {
      title: 'The Power of Synergy',
      text: 'When the healing energy of Reiki meets the natural vibrations of crystals, it creates a powerful synergy that enhances your physical, emotional and spiritual well-being.'
    },
    extras: [
      {
        type: 'steps',
        title: 'What Are Reiki Stones & How Do You Create Them?',
        subtitle: 'To program a crystal and create a Reiki stone, simply do the following:',
        items: [
          { title: 'Hold the Crystal', icon: 'Hand', text: 'Place it in your palm and activate Reiki (you\u2019ll need to be a certified Reiki practitioner to be able to do this).' },
          { title: 'Set Your Intention', icon: 'Target', text: 'Focus on your healing intention and tell the crystal its purpose.' },
          { title: 'Allow the Energy to Flow', icon: 'Sparkles', text: 'Let the energy flow between your palms and through the stone. This can last between 5 and 15 minutes, or until you feel the energy cooling off.' }
        ]
      },
      {
        type: 'steps',
        title: 'How are Reiki Crystals Used?',
        items: [
          { title: 'Choose the Right Crystal', icon: 'Gem', text: 'First, we choose the healing crystal with the properties that are most compatible with the root problem we are trying to heal.' },
          { title: 'Cleanse with Reiki', icon: 'HandHeart', text: 'Next, we cleanse the healing crystal with Reiki so that it becomes a Reiki stone.' },
          { title: 'Place & Channel Reiki', icon: 'PersonStanding', text: 'Then, we place the healing crystal on the targeted body part of the client and pace our hands over it to channel Reiki.' }
        ]
      }
    ],
    journey: {
      title: 'Begin Your Healing Journey',
      text: 'Discover the beautiful combination of crystals and Reiki and bring balance, positivity and inner peace into your life.'
    }
  },

  /* ───────────────────────── COLOUR THERAPY ───────────────────────── */
  'color-therapy': {
    eyebrow: ['Balance', 'Heal', 'Energize', 'Transform'],
    title: 'Colour Therapy',
    tagline: 'Heal with the Power of Colours',
    intro: 'Colour therapy, or chromotherapy, uses specific colours on body areas to support well-being. It is a complementary therapy, not a substitute for medical care, and results may vary.',
    what: {
      title: 'What does Colour Therapy do?',
      icon: 'Palette',
      text: 'Colours are made up of reflected lights that hit our retinas as the wavelengths vibrate. Our brain interprets these wavelengths, which ultimately makes our perception of colour as a physical and sensory experience.'
    },
    use: {
      title: 'The Basic Idea of Colour Therapy',
      text: 'Colour therapy is based on the idea that colours create an electrical impulse in our brain, which stimulates hormonal and biochemical processes in our body. These processes either stimulate or calm us.',
      items: [
        { label: 'Stimulates Natural Healing', icon: 'Leaf' },
        { label: 'Balances Emotions', icon: 'Flower2' },
        { label: 'Supports Overall Well-being', icon: 'Sun' }
      ]
    },
    extras: [
      {
        type: 'paragraphs',
        title: 'How to Get Started with Colour Therapy?',
        paragraphs: [
          'Colour therapy uses rainbow colours to promote well-being, often combined with aromatherapy, coloured lights during massages, or coloured silk placed on the body to support mood and emotional balance. The choice of colours may vary according to individual needs and preferences.',

        ]
      }
    ],
    journey: {
      title: 'Experience the Healing Power of Colours',
      text: 'Discover how colours can bring balance, positivity and harmony to your life through the gentle and natural approach of colour therapy.',
      rainbow: true
    }
  }
};

export const hasCourseDetails = (id) => Boolean(COURSE_DETAILS[id]);
