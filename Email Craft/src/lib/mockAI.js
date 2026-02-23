export const generateEmailCampaign = async ({ goal, audience, tone, points }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simulate processing time
      const pointList = points
        ? points.split('\n').filter(p => p.trim()).map(p => p.trim())
        : ['Innovative strategies', 'Proven results', 'Community support'];

      const subjectLines = generateSubjectLines(goal, audience, tone);
      const body = generateEmailBody(goal, audience, tone, pointList);

      resolve({
        subjectLines,
        body
      });
    }, 2000); // 2 second delay to simulate AI thinking
  });
};

// --- Helper Functions for "AI" Logic ---

const generateSubjectLines = (goal, audience, tone) => {
  const templates = {
    Professional: [
      `Achieving ${goal}: A Strategic Guide for ${audience}`,
      `The Future of ${goal} for Forward-Thinking ${audience}`,
      `Optimizing Your Approach to ${goal}`,
      `Key Insights: How ${audience} Can Master ${goal}`,
      `Your Roadmap to ${goal} Success`
    ],
    Friendly: [
      `Hey ${audience}, let's talk about ${goal}!`,
      `Ready to crush ${goal}? We can help!`,
      `A little something to help you with ${goal} 🚀`,
      `Making ${goal} easier for you, ${audience}`,
      `We think you'll love this idea for ${goal}`
    ],
    Urgent: [
      `Don't Miss Out: The Time for ${goal} is Now`,
      `Urgent Update regarding ${goal} for ${audience}`,
      `Last Chance to Revolutionize Your ${goal} Strategy`,
      `Are You Behind on ${goal}? Catch Up Today`,
      `Immediate Action Required: ${goal} Opportunities`
    ],
    Persuasive: [
      `Why ${audience} Are Switching to This ${goal} Method`,
      `Unlock the Secret to effortless ${goal}`,
      `Stop Struggling with ${goal} - Try This Instead`,
      `Imagine What You Could Do with Better ${goal}`,
      `The #1 Mistake ${audience} Make with ${goal}`
    ]
  };

  // Fallback to specific tone or mix if tone not found
  const selectedTemplates = templates[tone] || [
    ...templates.Professional.slice(0, 2),
    ...templates.Persuasive.slice(0, 2),
    ...templates.Friendly.slice(0, 1)
  ];

  // Shuffle and pick 5
  return selectedTemplates.sort(() => 0.5 - Math.random()).slice(0, 5);
};

const generateEmailBody = (goal, audience, tone, points) => {
  const intros = {
    Professional: `Dear ${audience},\n\nIn today's rapidly evolving landscape, maintaining a competitive edge requires a dedicated focus on ${goal}. We understand the unique challenges facing professionals like you and have developed a comprehensive solution designed to streamline your efforts.`,
    Friendly: `Hi ${audience}!\n\nWe know how much you care about ${goal}, and honestly? We do too! It's such a vital part of what you do, but it doesn't have to be a headache. We've been working on something special that we think will really brighten your workflow.`,
    Urgent: `Attention ${audience},\n\nThe window of opportunity for effective ${goal} is narrowing. Competitors are already adapting, and delaying your strategy could be costly. It is imperative to address ${goal} immediately to ensure you don't fall behind.`,
    Persuasive: `Hello ${audience},\n\nImagine hitting your targets for ${goal} without the usual stress or overhead. It sounds like a dream, but for many in your field, it's becoming a reality. The secret lies in a smarter, more efficient approach that targets exactly what you need.`
  };

  const transitions = {
    Professional: "Our methodology is built on three core pillars of excellence:",
    Friendly: "Here are a few ways we can make things awesome for you:",
    Urgent: "Here is what you need to focus on right now:",
    Persuasive: "Consider the benefits of our proven strategy:"
  };

  const outros = {
    Professional: "We invite you to review our full proposal. Please contact us at your earliest convenience to discuss how we can align with your strategic objectives.\n\nSincerely,\nThe Email Craft Team",
    Friendly: "Give it a look and let us know what you think! We're super excited to potentially work with you.\n\nBest,\nThe Email Craft Team",
    Urgent: "Time is of the essence. Click below to secure your advantage before the market shifts further.\n\nRegards,\nThe Email Craft Team",
    Persuasive: "Don't settle for the status quo. Join the leaders who are redefining ${goal} today.\n\nCheers,\nThe Email Craft Team"
  };

  // Default to Professional if tone is standard
  const selectedTone = intros[tone] ? tone : 'Professional';

  const introText = intros[selectedTone];
  const transitionText = transitions[selectedTone];

  // Smart Point Generation
  const usedGenerics = new Set();
  const pointText = points.map((p, index) => {
    const description = generatePointDescription(p, selectedTone, goal, index, usedGenerics);
    return `- **${p}**: ${description}`;
  }).join('\n');

  const outroText = outros[selectedTone];

  return `${introText}

${transitionText}

${pointText}

${outroText}`;
};

const generatePointDescription = (point, tone, goal, index, usedGenerics) => {
  const pLower = point.toLowerCase();

  // 1. Keyword-based matching (Context Aware)
  if (pLower.includes('%') || pLower.includes('off') || pLower.includes('save') || pLower.includes('discount')) {
    const options = [
      "This ensures maximum value and immediate ROI for your budget.",
      "A direct way to improve your bottom line while maintaining quality.",
      "Substantial savings that can be reinvested into other growth areas."
    ];
    return options[index % options.length];
  }

  if (pLower.includes('date') || pLower.includes('time') || pLower.includes('deadline') || pLower.includes('now') || pLower.includes('today')) {
    const options = [
      "Acting within this timeframe is crucial for securing this advantage.",
      "Time-sensitivity is key to leveraging this opportunity fully.",
      "Don't let this limited window of opportunity slip away."
    ];
    return options[index % options.length];
  }

  if (pLower.includes('exclusive') || pLower.includes('only') || pLower.includes('vip') || pLower.includes('secret')) {
    const options = [
      `A unique benefit available specifically to our ${tone.toLowerCase()} partners.`,
      "Designed to give you a distinct competitive advantage in the market.",
      "Access resources that are generally unavailable to the wider public."
    ];
    return options[index % options.length];
  }

  if (pLower.includes('support') || pLower.includes('help') || pLower.includes('guide') || pLower.includes('team')) {
    const options = [
      "Our dedicated team is ready to assist you every step of the way.",
      "Never feel lost again with our comprehensive support structure.",
      "Expert guidance to ensure seamless implementation and success."
    ];
    return options[index % options.length];
  }

  // 2. Tone-based Generic Fallback (Rotating to avoid repetition)
  const genericOptions = {
    Professional: [
      `Delivers measurable impact on ${goal} through rigorous optimization.`,
      `Designed to align perfectly with high-level industry standards.`,
      `Facilitates a more streamlined workflow for better efficiency.`,
      `Enhances your operational capabilities significantly.`,
      `A critical component for sustainable long-term success.`
    ],
    Friendly: [
      `This represents a huge win for your ${goal} goals!`,
      `We think you're really going to love how this works.`,
      `Just one of the ways we make your life a little easier.`,
      `Super helpful for getting things done without the fuss.`,
      `A game-changer that puts a smile on your face.`
    ],
    Urgent: [
      `Critical for immediate ${goal} results.`,
      `This requires your attention now to avoid missing out.`,
      `A vital step that cannot be overlooked in this fast-paced market.`,
      `Essential for keeping up with rapid industry changes.`,
      `The fastest way to secure your position today.`
    ],
    Persuasive: [
      `See specifically how this transforms your ${goal} outcomes.`,
      `Imagine the difference this single factor will make.`,
      `Proven to outperform traditional methods by a significant margin.`,
      `The secret weapon that successful leaders are using right now.`,
      `Why settle for less when you can have this?`
    ]
  };

  const toneGenerics = genericOptions[tone] || genericOptions['Professional'];

  // Find an unused generic option
  let chosen = toneGenerics[0];
  for (let i = 0; i < toneGenerics.length; i++) {
    // Simple rotation based on index if we run out or just pick based on index to ensure variety
    // Mixing index and a set to "try" to be unique, but simple rotation is safest for mock AI
    const option = toneGenerics[(index + i) % toneGenerics.length];
    if (!usedGenerics.has(option)) {
      chosen = option;
      break;
    }
  }

  usedGenerics.add(chosen);
  return chosen;
};


// Keep the enhance function as is or slightly improve
export const enhanceEmailText = async (text, tone) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let enhanced = text;
      if (tone === 'Professional') {
        enhanced = text.replace(/Hi/g, 'Dear').replace(/check out/g, 'kindly review').replace(/awesome/g, 'exceptional');
      } else if (tone === 'Friendly') {
        enhanced = text.replace(/Dear/g, 'Hi').replace(/Sincerely/g, 'Cheers').replace(/ensure/g, 'make sure');
      }
      resolve(`[AI Enhanced - ${tone} Polish]\n\n${enhanced}`);
    }, 1500);
  });
};
