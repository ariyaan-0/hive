export const CURRENT_USER = {
  username: "aryanhossain",
  name: "Aryan Hossain",
  email: "aryan.hossain@example.com",
  bio: "Designer, Developer, and coffee lover. Building things for the web.",
  profilePicture: "https://ui-avatars.com/api/?name=Aryan+Hossain&background=000000&color=fff&size=200"
};

export const USERS = {
  alice_wonder: {
    username: "alice_wonder",
    name: "Alice Liddell",
    bio: "Lost in a good book. Exploring the intersection of magic and mundane.",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
  },
  bookworm_99: {
    username: "bookworm_99",
    name: "Benjamin Books",
    bio: "Reading everything I can get my hands on. Give me a recommendation!",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
  },
  vintage_lens: {
    username: "vintage_lens",
    name: "Victor Lens",
    bio: "Capturing light on light-sensitive chemicals. 35mm forever.",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
  }
};

export const POSTS = [
  {
    id: 1,
    title: "The Joy of Slow Mornings",
    username: "alice_wonder",
    timestamp: "2 hours ago",
    content: "There's something magical about taking time with your morning coffee. No rushing, just enjoying the quiet moments before the world wakes up. Who else loves slow mornings?",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600",
    upvotes: 24,
    downvotes: 1,
    comments: [
      { id: 101, username: "vintage_lens", timestamp: "1 hour ago", text: "Absolutely! It sets the tone for the entire day." },
      { id: 102, username: "aryanhossain", timestamp: "30 mins ago", text: "I can't function without my 7am pour-over ritual." }
    ]
  },
  {
    id: 2,
    title: "Reading Recommendations?",
    username: "bookworm_99",
    timestamp: "4 hours ago",
    content: "I've just finished reading 'The Midnight Library' and I'm looking for something similar. Any suggestions from this wonderful community?\n\nI particularly enjoy magical realism and historical fiction.",
    upvotes: 42,
    downvotes: 0,
    comments: [
      { id: 201, username: "alice_wonder", timestamp: "3 hours ago", text: "You should definitely check out 'The Invisible Life of Addie LaRue'!" },
      { id: 202, username: "vintage_pages", timestamp: "2 hours ago", text: "If you like historical fiction with a twist of magic, 'The Night Circus' is unparalleled." }
    ]
  },
  {
    id: 3,
    title: "Rediscovering Film Photography",
    username: "vintage_lens",
    timestamp: "6 hours ago",
    content: "Pulled out my grandfather's old Canon AE-1 this weekend. The tactile feeling of winding the film and waiting to see how the shots turned out is such a refreshing change from instant digital gratification.",
    image: null,
    upvotes: 89,
    downvotes: 2,
    comments: []
  },
  {
    id: 4,
    title: "Building out Hive!",
    username: "aryanhossain",
    timestamp: "Just now",
    content: "Welcome to my portfolio application! I am piecing together a vintage-inspired social hub using Tailwind v4. The design system here embraces warm parchment colors and strict UI rules to guarantee a cozy experience.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600",
    upvotes: 350,
    downvotes: 0,
    comments: [
      { id: 401, username: "alice_wonder", timestamp: "Just now", text: "The layout is spectacular. Really love the coffee-brown aesthetic!" }
    ]
  }
];
