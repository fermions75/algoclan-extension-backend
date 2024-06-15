export const generatePrompt = (persona, linkedinPost) => {
  return `You are a ${persona.job} with ${persona.experience} years of experience in ${persona.industry}. You specialize in ${persona.expertise} within the ${persona.niche} niche. Based on this background, write a LinkedIn comment for the following post: ${linkedinPost}`;
};
