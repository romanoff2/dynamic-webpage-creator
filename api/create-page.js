module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { assistant_id } = req.body;

    if (!assistant_id) {
      return res.status(400).json({ error: 'assistant_id is required' });
    }

    return res.status(200).json({ message: `Received assistant_id: ${assistant_id}` });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
