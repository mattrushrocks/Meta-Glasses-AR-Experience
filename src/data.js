export const gestures = [
  {
    id: "tap",
    name: "Single Tap",
    location: "Right temple touchpad",
    action: "Capture photo or confirm a prompt",
    useCase: "User wants a quick capture without reaching for a phone.",
    description: "The index finger taps once on the temple surface near the frame edge.",
    uxNote: "Fast and memorable, but the exact tap zone needs a clear first-use cue.",
    discoverability: "Easy to remember after onboarding",
    tone: "Confident",
    path: "pulse",
    anchorId: "right-temple-touch-front",
    zone: "temple",
    concern: "Accidental taps can happen while adjusting the glasses."
  },
  {
    id: "double-tap",
    name: "Double Tap",
    location: "Right temple touchpad",
    action: "Wake assistant or replay a prompt",
    useCase: "User wants to recover from a missed cue while staying in motion.",
    description: "Two quick taps on the temple, shown as paired contact pulses.",
    uxNote: "Useful for confirmation, but timing may be hard for new users.",
    discoverability: "Somewhat hidden",
    tone: "Careful",
    path: "double",
    anchorId: "right-temple-touch-mid",
    zone: "touch control",
    concern: "Can be confused with a single tap if the system feedback is quiet."
  },
  {
    id: "swipe-forward",
    name: "Swipe Forward",
    location: "Right temple touchpad",
    action: "Skip track or move to the next item",
    useCase: "User is walking and wants hands-light media control.",
    description: "The finger glides forward along the temple surface toward the lens.",
    uxNote: "Useful once learned, but not visually discoverable from the product form.",
    discoverability: "Hidden until taught",
    tone: "Efficient",
    path: "forward",
    anchorId: "right-temple-swipe-forward",
    zone: "temple",
    concern: "Motion direction can feel ambiguous when the user is wearing the product."
  },
  {
    id: "swipe-backward",
    name: "Swipe Backward",
    location: "Right temple touchpad",
    action: "Previous track or back step",
    useCase: "User wants to undo a media choice without stopping.",
    description: "The finger glides backward along the temple surface away from the lens.",
    uxNote: "Pairs well with swipe forward, but needs consistent feedback to feel reliable.",
    discoverability: "Hidden until taught",
    tone: "Reassuring",
    path: "backward",
    anchorId: "right-temple-swipe-back",
    zone: "temple",
    concern: "Users may not know whether backward means toward the ear or toward the phone timeline."
  },
  {
    id: "press-hold",
    name: "Press and Hold",
    location: "Frame edge and temple junction",
    action: "Start listening or hold-to-talk",
    useCase: "User needs help or navigation in a noisy public moment.",
    description: "The finger presses and stays in place until the system gives a listening cue.",
    uxNote: "Intentional and low-error, but socially noticeable when held too long.",
    discoverability: "Moderately intuitive",
    tone: "Focused",
    path: "hold",
    anchorId: "frame-temple-junction",
    zone: "frame edge",
    concern: "A long hold can feel awkward when the user is being watched."
  },
  {
    id: "voice-trigger",
    name: "Voice Trigger",
    location: "Microphone and audio input zones",
    action: "Ask Meta AI for help, search, or navigation",
    useCase: "User cannot spare visual attention and wants spoken guidance.",
    description: "The hand stays away from the glasses while the audio zone highlights.",
    uxNote: "Natural when private, but public speech raises social comfort questions.",
    discoverability: "Intuitive but context sensitive",
    tone: "Exposed",
    path: "voice",
    anchorId: "audio-camera-zone",
    zone: "audio/input",
    concern: "Users may avoid voice in social settings even when it is functionally best."
  }
];

export const anchors = [
  {
    id: "right-temple-touch-front",
    label: "Touch Control",
    target: "rightTemple",
    localPosition: [1.0, 0.16, 0.1],
    offset: [0.02, 0.04, 0],
    zone: "temple",
    type: "gesture"
  },
  {
    id: "right-temple-touch-mid",
    label: "Double Tap Area",
    target: "rightTemple",
    localPosition: [1.16, 0.14, 0.4],
    offset: [0.02, 0.04, 0],
    zone: "touch control",
    type: "gesture"
  },
  {
    id: "right-temple-swipe-forward",
    label: "Forward Swipe",
    target: "rightTemple",
    localPosition: [1.25, 0.12, 0.72],
    offset: [0.02, 0.04, 0],
    zone: "temple",
    type: "gesture"
  },
  {
    id: "right-temple-swipe-back",
    label: "Back Swipe",
    target: "rightTemple",
    localPosition: [1.38, 0.08, 1.04],
    offset: [0.02, 0.04, 0],
    zone: "temple",
    type: "gesture"
  },
  {
    id: "frame-temple-junction",
    label: "Frame Edge",
    target: "frontFrame",
    localPosition: [0.86, 0.23, -1.18],
    offset: [0.02, 0.04, -0.02],
    zone: "frame edge",
    type: "hardware"
  },
  {
    id: "audio-camera-zone",
    label: "Audio Input",
    target: "frontFrame",
    localPosition: [-0.92, 0.18, -1.14],
    offset: [-0.01, 0.03, 0],
    zone: "audio/input",
    type: "hardware"
  },
  {
    id: "body-frame",
    label: "Body",
    target: "frontFrame",
    localPosition: [0.0, 0.08, -0.96],
    offset: [0, 0.07, 0],
    zone: "frame edge",
    type: "hardware"
  },
  {
    id: "speaker-arm",
    label: "Speaker",
    target: "templeArm",
    localPosition: [-1.18, 0.12, 0.54],
    offset: [-0.02, 0.05, 0],
    zone: "audio/input",
    type: "hardware"
  }
];

export const featureHotspots = [
  {
    id: "camera",
    name: "Camera",
    anchorId: "frame-temple-junction",
    zone: "frame edge",
    location: "Front frame camera area",
    action: "Capture photos or video from the wearer's point of view.",
    whatItDoes: "Lets the user quickly capture photos or video from their point of view.",
    whyItMatters: "Makes it easy to document a moment hands-free without pulling out a phone.",
    personaInsight: "Some users may find this exciting and convenient, while others may hesitate if the camera state is not obvious.",
    likelyInteraction: "Tap or voice command to capture content.",
    emotionalNote: "Curiosity, excitement, or slight social hesitation in public settings."
  },
  {
    id: "touchpad",
    name: "Touchpad",
    anchorId: "right-temple-touch-mid",
    zone: "touch control",
    location: "Right temple touch surface",
    action: "Control media and system functions through tap, swipe, or hold gestures.",
    whatItDoes: "Allows the user to control media and other functions through tap, swipe, or hold gestures.",
    whyItMatters: "This is one of the main interaction points and helps the glasses feel quick and lightweight to use.",
    personaInsight: "Proto-personas may try familiar gestures first, but can be unsure where the touch area begins and ends.",
    likelyInteraction: "Tap, swipe forward/back, press and hold.",
    emotionalNote: "Confidence grows with practice, but first-time users may feel unsure or frustrated if feedback is unclear."
  },
  {
    id: "microphone",
    name: "Microphone",
    anchorId: "audio-camera-zone",
    zone: "audio/input",
    location: "Audio input zone",
    action: "Capture voice input for commands, assistant use, and hands-free interaction.",
    whatItDoes: "Captures voice input for commands, assistant use, and hands-free interaction.",
    whyItMatters: "Supports natural interaction when the user is moving or does not want to rely only on touch gestures.",
    personaInsight: "Some proto-personas may like the convenience of voice, while others may avoid it in public or shared spaces.",
    likelyInteraction: "Voice prompt, press and hold, or wake phrase.",
    emotionalNote: "Convenience mixed with possible social self-consciousness."
  },
  {
    id: "speaker",
    name: "Speaker",
    anchorId: "speaker-arm",
    zone: "audio/input",
    location: "Open-ear speaker area",
    action: "Plays music, navigation, prompts, and assistant responses through the glasses.",
    whatItDoes: "Delivers audio without fully covering the user's ears.",
    whyItMatters: "Keeps music, navigation, and feedback available while the user stays aware of the environment.",
    personaInsight: "Audio-focused users value quick listening, while classroom or public users may keep volume low and context-aware.",
    likelyInteraction: "Swipe for tracks, tap to pause, voice or hold for assistant audio.",
    emotionalNote: "Convenience and immersion, balanced with awareness of people nearby."
  },
  {
    id: "body",
    name: "Body",
    anchorId: "body-frame",
    zone: "frame edge",
    location: "Frame body",
    action: "House core hardware and define comfort, wearability, and visual identity.",
    whatItDoes: "The physical frame houses the core hardware and defines comfort, wearability, and overall visual identity.",
    whyItMatters: "The body affects whether the glasses feel natural, stylish, and comfortable enough for long-term use.",
    personaInsight: "Proto-personas may judge the device quickly based on comfort, familiarity, and whether it feels too technical or too noticeable.",
    likelyInteraction: "Adjustment, wear, repositioning on face, general handling.",
    emotionalNote: "Comfort, trust, or hesitation depending on fit and visual confidence."
  }
];

export const journeyStages = [
  {
    id: "entry",
    title: "Entry / Setup",
    modelFocus: "temple",
    gestures: [
      { type: "tap", confidence: "low" },
      { type: "hover", confidence: "hesitant" }
    ],
    features: ["touch_sensor", "onboarding_feedback"],
    persona: {
      feeling: "curious",
      state: "confused",
      quote: "Wait... where do I touch?",
      behavior: "hesitates and looks for guidance"
    },
    experience: {
      context: "first-time use",
      audio: "none or onboarding prompt"
    },
    ui: {
      hotspots: "minimal",
      gestureHints: true,
      personaVisible: true,
      highlight: "temple"
    }
  },
  {
    id: "discovery",
    title: "Discovery / Exploration",
    modelFocus: "temple",
    gestures: [
      { type: "swipe", confidence: "low" },
      { type: "tap", confidence: "repeated" }
    ],
    features: ["gesture_controls", "feedback_system"],
    persona: {
      feeling: "curious",
      state: "learning",
      quote: "Oh wait... that did something",
      behavior: "repeats gestures to understand system"
    },
    experience: {
      context: "exploring gestures",
      audio: "feedback sounds"
    },
    ui: {
      hotspots: "few",
      gestureHints: true,
      personaVisible: true,
      highlight: "interaction_zones"
    }
  },
  {
    id: "interaction",
    title: "Content Interaction",
    modelFocus: "speaker",
    gestures: [
      { type: "swipe", confidence: "medium" },
      { type: "tap", confidence: "medium" },
      { type: "hold", confidence: "emerging" }
    ],
    features: ["audio_system", "music_controls", "navigation"],
    persona: {
      feeling: "comfortable",
      state: "engaged",
      quote: "This is actually nice",
      behavior: "uses gestures while moving"
    },
    experience: {
      context: "music or navigation",
      audio: "music playing"
    },
    ui: {
      hotspots: "contextual",
      gestureHints: false,
      personaVisible: true,
      highlight: "speaker"
    }
  },
  {
    id: "peak",
    title: "Peak Engagement",
    modelFocus: "full",
    gestures: [
      { type: "swipe", confidence: "high" },
      { type: "tap", confidence: "high" }
    ],
    features: ["seamless_interaction", "multi_feature_usage"],
    persona: {
      feeling: "confident",
      state: "immersed",
      quote: "I don't even think about it anymore",
      behavior: "fast, natural gestures"
    },
    experience: {
      context: "flow state",
      audio: "music + notifications"
    },
    ui: {
      hotspots: "minimal",
      gestureHints: false,
      personaVisible: false,
      highlight: "none"
    }
  },
  {
    id: "friction",
    title: "Friction / Confusion",
    modelFocus: "temple",
    gestures: [
      { type: "swipe", confidence: "failed" },
      { type: "repeat", confidence: "frustrated" }
    ],
    features: ["gesture_detection", "interaction_zones"],
    persona: {
      feeling: "frustrated",
      state: "confused",
      quote: "Why isn't this working?",
      behavior: "retries gestures multiple times"
    },
    experience: {
      context: "gesture failure",
      audio: "interrupted playback"
    },
    ui: {
      hotspots: "highlight_problem_area",
      gestureHints: true,
      personaVisible: true,
      highlight: "temple"
    }
  },
  {
    id: "recovery",
    title: "Recovery",
    modelFocus: "temple",
    gestures: [
      { type: "swipe", confidence: "controlled" },
      { type: "tap", confidence: "intentional" }
    ],
    features: ["feedback_system"],
    persona: {
      feeling: "relieved",
      state: "learning",
      quote: "Oh okay, I see now",
      behavior: "adjusts interaction style"
    },
    experience: {
      context: "learning correction",
      audio: "resumed playback"
    },
    ui: {
      hotspots: "guided",
      gestureHints: true,
      personaVisible: true,
      highlight: "interaction_zones"
    }
  },
  {
    id: "long_term",
    title: "Long-Term Use",
    modelFocus: "full",
    gestures: [
      { type: "subtle_swipe", confidence: "high" },
      { type: "quick_tap", confidence: "high" }
    ],
    features: ["passive_audio", "routine_use"],
    persona: {
      feeling: "comfortable",
      state: "habitual",
      quote: "It just fits into my day",
      behavior: "minimal conscious interaction"
    },
    experience: {
      context: "daily routine",
      audio: "background music"
    },
    ui: {
      hotspots: "minimal",
      gestureHints: false,
      personaVisible: false,
      highlight: "none"
    }
  }
];

export const personaJourneys = [
  {
    id: "sheila",
    name: "Sheila Applegate",
    archetype: "The Apple Loyalist",
    age: 56,
    role: "High school teacher",
    platform: "Ray-Ban Meta Gen 1 Wayfarer",
    summary: "Picked up Meta glasses because they feel close to her Apple ecosystem, then kept using them for classroom support.",
    defaultStageId: "entry",
    moments: {
      camera: {
        feeling: "cautious",
        doing: "considering whether capture is appropriate in a classroom setting",
        why: "She wants documentation or classroom support without disrupting students.",
        where: "classroom or hallway",
        journey: "Classroom support",
        listening: "quiet capture chime or system confirmation",
        when: "only when the moment feels appropriate"
      },
      touchpad: {
        feeling: "uncertain",
        doing: "trying familiar tap and swipe gestures to find the control area",
        why: "She needs quick control without pulling out a phone during school routines.",
        where: "at her desk before class starts",
        journey: "Entry / Setup",
        listening: "onboarding prompt or soft feedback tone",
        when: "before students arrive or between classes"
      },
      microphone: {
        feeling: "careful",
        doing: "using voice only when it will not interrupt the room",
        why: "Voice support is useful, but it needs to feel discreet and professional.",
        where: "empty classroom or office",
        journey: "Long-Term Use",
        listening: "assistant response or reminder audio",
        when: "planning period or after school"
      },
      speaker: {
        feeling: "aware",
        doing: "keeping audio quiet enough to stay present with students",
        why: "She needs reminders and prompts without isolating herself from the classroom.",
        where: "classroom, hallway, or teacher workroom",
        journey: "Classroom support",
        listening: "low-volume reminders, spoken prompts, or confirmation tones",
        when: "between instruction moments"
      },
      body: {
        feeling: "evaluating",
        doing: "judging whether the frame feels familiar, comfortable, and classroom-appropriate",
        why: "If the glasses feel natural, she is more likely to keep using them.",
        where: "wearing them through a school day",
        journey: "Comfort / Trust",
        listening: "ambient classroom noise with occasional system feedback",
        when: "all-day wear moments"
      },
      tap: {
        feeling: "careful",
        doing: "testing the touch surface before using it around students",
        why: "She wants simple, reliable classroom support without pulling out another device.",
        where: "at her desk before class starts",
        journey: "Entry / Setup",
        listening: "onboarding tone or a quiet confirmation chime",
        when: "before students arrive"
      },
      "double-tap": {
        feeling: "reassured",
        doing: "repeating a command to make sure the system heard her",
        why: "She needs confidence before trusting the glasses during a lesson.",
        where: "between classes in the hallway",
        journey: "Recovery",
        listening: "short system feedback, not music",
        when: "after a missed or uncertain response"
      },
      "swipe-forward": {
        feeling: "focused",
        doing: "moving through audio or prompt feedback without touching her phone",
        why: "Hands-free control helps her stay present while preparing materials.",
        where: "classroom desk or copy room",
        journey: "Discovery / Exploration",
        listening: "a teaching podcast, reminder audio, or setup prompt",
        when: "during prep time"
      },
      "swipe-backward": {
        feeling: "slightly frustrated",
        doing: "backing up after skipping past something useful",
        why: "She needs forgiving controls while learning where the gesture area begins.",
        where: "teacher workroom",
        journey: "Friction / Confusion",
        listening: "interrupted playback or repeated instructions",
        when: "while correcting a gesture mistake"
      },
      "press-hold": {
        feeling: "supported",
        doing: "holding to ask for help, reminders, or quick classroom information",
        why: "The glasses become useful when they quietly support her teaching flow.",
        where: "front of classroom before a lesson",
        journey: "Content Interaction",
        listening: "spoken assistant response at low volume",
        when: "right before or after instruction"
      },
      "voice-trigger": {
        feeling: "cautious",
        doing: "using voice only when it will not interrupt students",
        why: "Voice is powerful, but she needs it to feel professional and discreet.",
        where: "empty classroom or office",
        journey: "Long-Term Use",
        listening: "assistant voice, reminders, or calendar prompts",
        when: "planning period or after school"
      }
    }
  },
  {
    id: "reid",
    name: "Reid Madsen",
    archetype: "The Audiophile",
    age: 34,
    role: "Computer programmer",
    platform: "Meta Glasses Gen 2",
    summary: "An avid tech fan exploring new audio technology. He listens when hands-free audio is best and captures moments without interrupting the experience.",
    defaultStageId: "interaction",
    moments: {
      camera: {
        feeling: "excited",
        doing: "capturing a concert or shared moment without breaking the experience",
        why: "He wants first-person memories without pulling out his phone.",
        where: "concert venue, street, or hangout with friends",
        journey: "Peak Engagement",
        listening: "live music, crowd noise, or the song he is capturing",
        when: "when something worth saving happens"
      },
      touchpad: {
        feeling: "in control",
        doing: "skipping, replaying, or adjusting audio through quick temple gestures",
        why: "Hands-free media control lets him keep listening when headphones are not ideal.",
        where: "commuting, walking, or coding away from his desk",
        journey: "Content Interaction",
        listening: "Spotify playlist, new releases, or shared playlists",
        when: "throughout the day"
      },
      microphone: {
        feeling: "experimental",
        doing: "asking Meta AI or using voice when his hands are busy",
        why: "He likes testing how voice and AI fit into his tech ecosystem.",
        where: "city street, desk setup, or concert lobby",
        journey: "Discovery / Exploration",
        listening: "assistant response layered over music",
        when: "when curiosity or navigation comes up"
      },
      speaker: {
        feeling: "immersed",
        doing: "listening throughout the day without switching to headphones",
        why: "Hands-free open-ear audio lets him keep music close while staying aware of his surroundings.",
        where: "commute, sidewalk, desk break, or concert line",
        journey: "Content Interaction",
        listening: "Spotify playlists, new releases, shared playlists, and notifications",
        when: "most routine movement moments"
      },
      body: {
        feeling: "comfortable",
        doing: "wearing the glasses as part of his daily tech setup",
        why: "The frame needs to feel stylish enough for routine use and technical enough to be worth exploring.",
        where: "daily commute, work breaks, concerts",
        journey: "Long-Term Use",
        listening: "background music plus notifications",
        when: "routine hands-free audio moments"
      },
      tap: {
        feeling: "excited",
        doing: "capturing a moment without taking out his phone",
        why: "He wants first-person memories from concerts and daily life without breaking the moment.",
        where: "concert venue or walking with friends",
        journey: "Peak Engagement",
        listening: "live music, crowd noise, or the track he is capturing",
        when: "when something worth saving happens"
      },
      "double-tap": {
        feeling: "curious",
        doing: "replaying or confirming a feature response",
        why: "He experiments with Meta AI and voice controls to understand what the glasses can do.",
        where: "at home with his tech setup",
        journey: "Discovery / Exploration",
        listening: "feature feedback sounds or assistant response",
        when: "while testing new features"
      },
      "swipe-forward": {
        feeling: "in control",
        doing: "skipping tracks without headphones or phone interaction",
        why: "He wants hands-free audio control when better headphones are not possible.",
        where: "commuting, walking, or coding away from his desk",
        journey: "Content Interaction",
        listening: "Spotify playlist or new release queue",
        when: "throughout the day"
      },
      "swipe-backward": {
        feeling: "engaged",
        doing: "going back to replay a song or notification",
        why: "Music discovery matters to him, so quick correction keeps him in the flow.",
        where: "on a walk or during a break from programming",
        journey: "Recovery",
        listening: "Spotify, album tracks, or shared playlists",
        when: "when he wants to replay something"
      },
      "press-hold": {
        feeling: "experimental",
        doing: "holding to ask Meta AI about music, directions, or a quick task",
        why: "He likes testing how voice and AI fit into his existing tech ecosystem.",
        where: "city street, concert lobby, or desk setup",
        journey: "Discovery / Exploration",
        listening: "assistant response layered over music",
        when: "when curiosity or navigation comes up"
      },
      "voice-trigger": {
        feeling: "confident",
        doing: "using voice controls when his hands are busy",
        why: "Voice lets him keep audio and capture moving without interrupting what he is doing.",
        where: "walking, commuting, or carrying gear",
        journey: "Long-Term Use",
        listening: "music plus notifications or Meta AI responses",
        when: "during routine hands-free moments"
      }
    }
  }
];

export const personas = [
  {
    id: "sheila",
    name: "Sheila",
    role: "Apple ecosystem loyalist",
    background: "Uses smart devices daily and expects fast, polished interactions.",
    context: "Moving between errands with music, calls, and quick photo moments.",
    goal: "Keep her flow without pulling out her phone.",
    quote: "I just want it to work the way my other devices do.",
    behavior: "Tries familiar touch gestures first, then waits for polished feedback.",
    painPoint: "May not understand where gesture controls begin and end.",
    opportunity: "Use onboarding animations and subtle haptics to make the touch surface feel bounded.",
    confidence: 82,
    emotion: "Curious, but impatient when the mapping is not obvious"
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Delivery cyclist",
    background: "Uses voice, navigation, and audio while staying alert in traffic.",
    context: "Riding through busy streets with limited ability to look down.",
    goal: "Act quickly without compromising safety.",
    quote: "If I have to think about the gesture, I already missed the turn.",
    behavior: "Uses broad, repeatable gestures and avoids anything that needs precision.",
    painPoint: "Small touch targets feel risky while moving.",
    opportunity: "Prioritize large forgiving zones, clear audio confirmation, and lockout states.",
    confidence: 64,
    emotion: "Practical, alert, and sensitive to friction"
  },
  {
    id: "nia",
    name: "Nia",
    role: "Travel creator",
    background: "Captures public moments and cares about social perception.",
    context: "Walking through a market, switching between capture and commentary.",
    goal: "Record naturally without making nearby people uncomfortable.",
    quote: "I want the capture to feel intentional, not sneaky.",
    behavior: "Looks for visible confirmation and tends to over-explain what she is doing.",
    painPoint: "Unclear capture cues can create social tension.",
    opportunity: "Make recording status and gesture feedback legible to both wearer and bystanders.",
    confidence: 71,
    emotion: "Excited, but socially cautious"
  }
];

export const scenarios = [
  {
    id: "first-setup",
    title: "First-time setup",
    stage: "Onboarding",
    summary: "The wearer learns where the gesture surface lives and how the system responds.",
    gestureIds: ["tap", "double-tap"],
    defaultGestureId: "tap",
    personaIds: ["sheila", "marcus", "nia"],
    camera: "front",
    insight: "Discovery is the product moment. Users need the glasses to teach the hand where to land."
  },
  {
    id: "quick-photo",
    title: "Taking a photo quickly",
    stage: "Capture",
    summary: "The user sees something fleeting and tries to capture it without breaking stride.",
    gestureIds: ["tap", "press-hold"],
    defaultGestureId: "tap",
    personaIds: ["sheila", "nia"],
    camera: "camera",
    insight: "Speed matters, but so does confidence that the capture actually happened."
  },
  {
    id: "music-control",
    title: "Controlling music on the go",
    stage: "Media",
    summary: "The user wants quick audio control without pulling out a phone.",
    gestureIds: ["swipe-forward", "swipe-backward", "tap"],
    defaultGestureId: "swipe-forward",
    personaIds: ["sheila", "marcus"],
    camera: "temple",
    insight: "The mapping is efficient after learning, but direction needs strong feedback."
  },
  {
    id: "navigation-help",
    title: "Asking for help or navigation",
    stage: "Assistance",
    summary: "The wearer needs guidance while their eyes and hands are busy.",
    gestureIds: ["press-hold", "voice-trigger"],
    defaultGestureId: "voice-trigger",
    personaIds: ["marcus", "nia"],
    camera: "audio",
    insight: "Voice is powerful, but publicness and noise shape whether users will actually use it."
  },
  {
    id: "gesture-confusion",
    title: "Confusion about discovery",
    stage: "Repair",
    summary: "The wearer accidentally triggers or misses a gesture and needs to recover.",
    gestureIds: ["double-tap", "swipe-backward", "press-hold"],
    defaultGestureId: "double-tap",
    personaIds: ["sheila", "marcus", "nia"],
    camera: "temple",
    insight: "Recovery gestures need to feel forgiving, not like a hidden command language."
  },
  {
    id: "public-settings",
    title: "Using glasses in public",
    stage: "Social setting",
    summary: "The user balances convenience with how visible or awkward the gesture feels.",
    gestureIds: ["voice-trigger", "tap", "press-hold"],
    defaultGestureId: "press-hold",
    personaIds: ["nia", "sheila"],
    camera: "wide",
    insight: "The emotional layer can override the functional best gesture."
  }
];

export const journeyMoments = [
  { id: "notice", label: "Notice", description: "The need appears in the environment." },
  { id: "reach", label: "Reach", description: "The hand moves toward the glasses or the user speaks." },
  { id: "commit", label: "Commit", description: "The gesture is performed and the system interprets intent." },
  { id: "feedback", label: "Feedback", description: "The wearer looks for confirmation that the action landed." },
  { id: "recover", label: "Recover", description: "The user corrects, repeats, or changes strategy." }
];
