import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, ChatMessage, SocialPost } from '../types';

// Initialize theme from localStorage immediately to prevent flickering
const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem('retailverse-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.isDarkMode || false;
    }
  } catch (error) {
    console.warn('Failed to parse stored theme:', error);
  }
  
  return false;
};

// Apply initial theme immediately
if (typeof window !== 'undefined') {
  const initialTheme = getInitialTheme();
  if (initialTheme) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Theme state
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Products state
  products: Product[];
  setProducts: (products: Product[]) => void;

  // Chat state
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;

  // Social state
  socialPosts: SocialPost[];
  setSocialPosts: (posts: SocialPost[]) => void;
  likeSocialPost: (postId: string) => void;

  // Visual search state
  visualSearchResults: any[];
  setVisualSearchResults: (results: any[]) => void;
  isVisualSearching: boolean;
  setIsVisualSearching: (searching: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Theme state
      isDarkMode: getInitialTheme(),
      toggleDarkMode: () => set((state) => {
        const newTheme = !state.isDarkMode;
        
        // Apply theme immediately to prevent flickering
        if (newTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        return { isDarkMode: newTheme };
      }),
      
      // Products state
      products: [],
      setProducts: (products) => set({ products }),
      
      // Chat state
      chatMessages: [],
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      clearChatHistory: () => set({ chatMessages: [] }),
      
      // Social state
      socialPosts: [],
      setSocialPosts: (posts) => set({ socialPosts: posts }),
      likeSocialPost: (postId) => set((state) => ({
        socialPosts: state.socialPosts.map(post =>
          post.id === postId 
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      })),
      
      
      
      // Visual search state
      visualSearchResults: [],
      setVisualSearchResults: (results) => set({ visualSearchResults: results }),
      isVisualSearching: false,
      setIsVisualSearching: (searching) => set({ isVisualSearching: searching }),
    }),
    {
      name: 'retailverse-store',
      partialize: (state) => ({
        user: state.user,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);