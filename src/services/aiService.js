import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const streamAIResponse = async (prompt, res) => {
  try {
    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Act as an linkedin engagement expert.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(content);
    }

    res.end(); // Ensure the connection is closed properly

    const chatCompletion = await stream.finalChatCompletion();
    // console.log(chatCompletion); // Log the final chat completion object if needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during OpenAI API call" });
  }
};
