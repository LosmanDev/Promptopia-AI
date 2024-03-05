import Prompt from '@models/prompt';
import { connectToDB } from '@utils/database';

// Handles fetching a single prompt by ID
//GET (READ)

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate('creator');
    if (!prompt) return new Response('Prompt not found', { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch all prompts', { status: 500 });
  }
};

// Handles updating a specific prompt's details
//PATCH (UPDATE)
export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt)
      return new Response('Prompt not found', { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response('Failed to update prompt', {
      status: 500,
    });
  }
};

// Handles deleting a specific prompt by ID
//DELETE (DELETE)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Using deleteOne to delete the prompt by ID
    const result = await Prompt.deleteOne({ _id: params.id });

    // Check if a document was deleted
    if (result.deletedCount === 0) {
      return new Response('Prompt not found', { status: 404 });
    }

    return new Response('Prompt deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting prompt:', error); // Added detailed error logging
    return new Response('Failed to Delete Prompt', { status: 500 });
  }
};
