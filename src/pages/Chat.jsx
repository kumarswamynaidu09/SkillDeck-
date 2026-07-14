import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Plus, Heart, MessageCircle, Repeat, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SAMPLE_POSTS = [
  {
    id: 'p1',
    author: { name: 'Sarah Jenkins', title: 'Frontend Developer', org: 'Google', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1' , verified: true},
    time: '2h',
    content: 'Excited to launch my AI Resume Builder today! It helps tailor your resume to any job description in seconds. Built with React, Node.js & OpenAI. Would love your feedback! 🚀',
    images: ['https://picsum.photos/1000/500?random=11'],
    tags: ['buildinpublic','react','ai','career'],
    likes: 324,
    comments: 52,
    reposts: 18
  },
  {
    id: 'p2',
    author: { name: 'Alex Chen', title: 'Product Manager', org: 'Microsoft', avatar: 'https://images.unsplash.com/photo-1531123414780-f8f3dbb4a6c5?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2', verified: true },
    time: '3h',
    content: 'Just shipped a new dashboard for real-time analytics. The journey from idea to product never gets old. What are you building this weekend? 🔧',
    images: ['https://picsum.photos/1000/500?random=21','https://picsum.photos/1000/500?random=22'],
    tags: ['productmanagement','analytics','dashboard'],
    likes: 215,
    comments: 41,
    reposts: 9
  },
  {
    id: 'p3',
    author: { name: 'InnovateHub', title: 'Community', org: '', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Innovate' },
    time: '12h',
    content: 'What technology are you most excited about in 2024?',
    images: [],
    tags: ['poll','community'],
    likes: 121,
    comments: 23,
    reposts: 5
  }
];

const ImageCarousel = memo(function ImageCarousel({ images }) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) return <img loading="lazy" src={images[0]} alt="post media" className="w-full h-52 object-cover rounded-xl mt-3" />;

  return (
    <div className="mt-3 overflow-x-auto rounded-xl snap-x snap-mandatory flex gap-2">
      {images.map((src, i) => (
        <div key={i} className="min-w-full snap-center flex-shrink-0">
          <img loading="lazy" src={src} alt={`media-${i}`} className="w-full h-52 object-cover rounded-xl" />
        </div>
      ))}
    </div>
  );
});

const PostCard = memo(function PostCard({ post }) {
  return (
    <article className="bg-[#0f1720] border border-white/5 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img loading="lazy" src={post.author.avatar} className="w-12 h-12 rounded-full border border-white/10 bg-slate-800 object-cover" alt="avatar" />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                {post.author.name}
                {post.author.verified && <span className="text-emerald-400 text-[10px] px-1 py-0.5 rounded">✔</span>}
              </div>
              <div className="text-xs text-slate-400">{post.author.title} {post.author.org ? `· ${post.author.org}` : ''}</div>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{post.time}</span>
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-200 whitespace-pre-wrap">{post.content}</div>

          {post.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-[12px] bg-white/2 px-2 py-1 rounded text-emerald-300">#{t}</span>
              ))}
            </div>
          )}

          <ImageCarousel images={post.images} />

          <div className="mt-3 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm"><Heart className="w-4 h-4 text-rose-400" /> <span>{post.likes}</span></button>
              <button className="flex items-center gap-2 text-sm"><MessageCircle className="w-4 h-4" /> <span>{post.comments}</span></button>
              <button className="flex items-center gap-2 text-sm"><Repeat className="w-4 h-4" /> <span>{post.reposts}</span></button>
            </div>
            <div>
              <button className="p-2 rounded-full hover:bg-white/5"><Bookmark className="w-4 h-4" /></button>
            </div>
          </div>

          {post.comments > 0 && (
            <div className="mt-2 text-xs text-slate-500">View all {post.comments} comments</div>
          )}
        </div>
      </div>
    </article>
  );
});

function CreatePostModal({ onClose, onCreate, user }) {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // object URLs
  const [tags, setTags] = useState('');

  const fileRef = useRef(null);

  const onFiles = (files) => {
    const arr = Array.from(files).slice(0, 6);
    const urls = arr.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const next = prev.slice();
      const removed = next.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const handleSubmit = () => {
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean).map(t => t.replace(/^#/, ''));
    // For demo, we pass image URLs; backend would handle uploads in production.
    onCreate({ text, images: images.map(i => i.url), tags: parsedTags });
    // cleanup
    images.forEach(i => URL.revokeObjectURL(i.url));
    setImages([]);
    setText('');
    setTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl max-w-md w-full p-4">
        <div className="flex items-start gap-3 mb-3">
          <img src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share something with the community..." className="w-full bg-transparent resize-none min-h-[80px] outline-none" />

            {images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={img.url} className="relative">
                    <img src={img.url} className="w-full h-20 object-cover rounded" alt={`preview-${i}`} />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <input ref={fileRef} onChange={(e) => onFiles(e.target.files)} accept="image/*" type="file" multiple className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-xl bg-white/5">Add images</button>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#tags, comma,separated" className="ml-2 px-3 py-2 rounded-xl bg-white/5 text-sm flex-1" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-300">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold">Post</button>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => navigate('/login'));
  }, [navigate]);

  // Simple infinite scroll handler
  // Throttled infinite scroll using rAF to avoid jank
  const loadingRef = useRef(false);
  useEffect(() => { loadingRef.current = loadingMore; }, [loadingMore]);

  const onScroll = useCallback((e) => {
    const el = e.target;
    if (loadingRef.current) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) {
      loadingRef.current = true;
      setLoadingMore(true);
      // simulate network
      setTimeout(() => {
        setPosts(prev => [...prev, ...SAMPLE_POSTS.map(p => ({ ...p, id: p.id + Math.random().toString(36).slice(2,8) }))]);
        setLoadingMore(false);
        loadingRef.current = false;
      }, 700);
    }
  }, []);

  const handleCreate = ({ text }) => {
    const newPost = {
      id: 'p' + Date.now(),
      author: { name: user.full_name || 'You', title: user.title || '', org: user.company || '', avatar: user.avatar_url },
      time: 'Just now',
      content: text,
      images: [],
      likes: 0,
      comments: 0,
      reposts: 0
    };
    setPosts(prev => [newPost, ...prev]);
  };

  if (!user) return null;

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col relative overflow-hidden font-sans text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* TOP ROW: Chat icon, Search, Create Post + */}
      <div className="relative pt-4 px-4 pb-3 z-40 flex items-center max-w-md mx-auto w-full gap-3">
        <button onClick={() => navigate('/messages')} className="p-2 rounded-full hover:bg-white/5"><MessageSquare className="w-6 h-6" /></button>

        <div className="flex-1 flex justify-center">
          <div className="w-[72%] relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search people, startups, posts, skills..." className="w-full py-3 pl-10 pr-4 rounded-3xl bg-black/40 border border-white/5 placeholder:text-slate-500 focus:outline-none" />
          </div>
        </div>

        <button onClick={() => setShowCreate(true)} aria-label="Create post" className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* FEED */}
      <div ref={feedRef} onScroll={onScroll} className="relative z-10 flex-1 overflow-y-auto px-4 pb-6 space-y-4 max-w-md mx-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="pt-2" />
        {posts.map(post => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <PostCard post={post} />
          </motion.div>
        ))}

        {loadingMore && (
          <div className="space-y-3">
            <div className="h-28 bg-white/3 rounded-2xl animate-pulse" />
            <div className="h-28 bg-white/3 rounded-2xl animate-pulse" />
          </div>
        )}
      </div>

      <AnimatePresence>{showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreate={handleCreate} user={user} />}</AnimatePresence>
    </div>
  );
}