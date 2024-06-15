import { streamAIResponse } from "../services/aiService.js";
import { getPersonaDetails } from "../services/personaService.js";
import { generatePrompt } from "../utils/promptGenerator.js";
import User from "../models/User.js";

export const getLinkedInComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { personaId, linkedinPost } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has available requests
    if (user.availableRequest <= 0) {
      return res
        .status(403)
        .json({ message: "You have passed your limit of available requests" });
    }

    // Decrement the available requests
    user.availableRequest -= 1;

    // Save the updated user object
    await user.save();

    // Retrieve persona details
    const persona = await getPersonaDetails(personaId);

    // Generate prompt based on persona and LinkedIn post
    const prompt = generatePrompt(persona, linkedinPost);

    // Stream the AI response
    await streamAIResponse(prompt, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
