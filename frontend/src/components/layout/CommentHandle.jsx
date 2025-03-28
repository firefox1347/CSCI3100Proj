export const fetchComments = async () => {
  // to be done
  };
  
  export const createComment = async (commentData) => {
    const response = await fetch('/comments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error('Failed to post comment');
    return response.json();
  };