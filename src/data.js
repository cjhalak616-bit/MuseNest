export const initialArticles = [
  {
    id: 'small-moments',
    title: 'The Beauty of Small Moments',
    category: 'Life',
    excerpt: 'Sometimes, it’s the little things that make life extraordinary.',
    author: 'MuseNest Writer',
    date: 'April 16, 2026',
    views: 1200,
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop&q=85',
    body: [
      'In a fast-paced world, we often chase big achievements, forgetting to appreciate the small joys that surround us. A kind smile, a good book, a beautiful sunset—these moments have the power to change our entire day.',
      'Life isn’t always about doing more, but about noticing more. When we slow down, we find peace, gratitude and a deeper connection to the world around us.',
      'So, take a moment today. Breathe. Look around. And remember — the best stories are often found in the simplest moments.'
    ]
  },
  {
    id: 'dream-bigger',
    title: 'Dream Bigger, Live Better',
    category: 'Creativity',
    excerpt: 'Give your imagination room to grow and turn little ideas into meaningful plans.',
    author: 'Aarohi Mehta',
    date: 'April 15, 2026',
    views: 892,
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&auto=format&fit=crop&q=85',
    body: ['Every meaningful journey begins with a thought. Give that thought time, attention and a little courage.', 'Make space for curiosity. Try something new, write down your ideas and let your creativity surprise you.']
  },
  {
    id: 'power-gratitude',
    title: 'The Power of Gratitude',
    category: 'Wellness',
    excerpt: 'A gentle reminder to notice what is already beautiful in your everyday life.',
    author: 'Ishita Rao',
    date: 'April 14, 2026',
    views: 743,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&auto=format&fit=crop&q=85',
    body: ['Gratitude is a small practice with a generous effect. It shifts our attention towards the good that already exists.', 'Begin with one thing each day. Over time, those little moments become a habit of seeing beauty.']
  },
  {
    id: 'healthier-happier',
    title: 'A Healthier, Happier You',
    category: 'Life',
    excerpt: 'Simple rituals that help you create a calmer and more balanced routine.',
    author: 'MuseNest Writer',
    date: 'April 12, 2026',
    views: 672,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=85',
    body: ['Wellbeing is built through small choices repeated with kindness.', 'Choose routines that support your energy, protect your rest and make room for the things you love.']
  },
  {
    id: 'slow-travel',
    title: 'Finding Wonder in New Places',
    category: 'Travel',
    excerpt: 'Travel slowly, look closely and collect moments instead of checklists.',
    author: 'Riya Kapoor',
    date: 'April 10, 2026',
    views: 518,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&auto=format&fit=crop&q=85',
    body: ['A new place can teach us to see familiar things differently.', 'Leave a little room in your itinerary for unexpected turns, quiet cafés and conversations with strangers.']
  },
  {
    id: 'future-of-ideas',
    title: 'A Little More Human in a Digital World',
    category: 'Technology',
    excerpt: 'Thoughtful ways to make technology serve our creativity, not replace it.',
    author: 'Kabir Sen',
    date: 'April 08, 2026',
    views: 491,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=85',
    body: ['Technology is most useful when it gives us more room to do meaningful work.', 'Use digital tools intentionally, keep learning and protect time for imagination.']
  }
]

export const categories = ['All', 'Life', 'Travel', 'Technology', 'Wellness', 'Creativity']
export const readArticles = () => JSON.parse(localStorage.getItem('cmsArticles') || 'null') || initialArticles
export const saveArticles = (items) => localStorage.setItem('cmsArticles', JSON.stringify(items))

export const getUser = () => {
  return JSON.parse(localStorage.getItem('cmsUser') || 'null');
};

export const saveUser = (user) => {
  localStorage.setItem('cmsUser', JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem('cmsUser');
  localStorage.removeItem('museNestToken');
};

export const getBookmarks = () => JSON.parse(localStorage.getItem('cmsBookmarks') || '[]')
