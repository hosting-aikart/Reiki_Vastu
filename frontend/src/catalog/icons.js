// Icons that courses and events can use, by name. Content saved from the
// admin panel stores the icon's name (e.g. "Sparkles"); the website turns
// it into the icon here. Unknown names fall back to a lotus-like flower.
import {
  Activity, Atom, Award, Brain, Briefcase, Building2, Check, CircleDot, Coins, Compass, Droplet,
  Droplets, Flame, Flower2, Gem, Hand, HandHeart, Hash, Heart, HeartPulse, Home, Layers, Leaf,
  Lightbulb, Moon, Mountain, Orbit, Palette, PersonStanding, Radio, Scale, Search, Shield,
  Sparkles, Star, Sun, Target, TreeDeciduous, TrendingUp, Triangle, Users, Wind
} from 'lucide-react';

export const ICONS = {
  Activity, Atom, Award, Brain, Briefcase, Building2, Check, CircleDot, Coins, Compass, Droplet,
  Droplets, Flame, Flower2, Gem, Hand, HandHeart, Hash, Heart, HeartPulse, Home, Layers, Leaf,
  Lightbulb, Moon, Mountain, Orbit, Palette, PersonStanding, Radio, Scale, Search, Shield,
  Sparkles, Star, Sun, Target, TreeDeciduous, TrendingUp, Triangle, Users, Wind
};

export const ICON_NAMES = Object.keys(ICONS).sort();

/** The icon component for a name (a component passed in is returned as is). */
export function iconFor(name, fallback = Flower2) {
  if (typeof name === 'function' || (name && typeof name === 'object')) return name;
  return ICONS[name] || fallback;
}

// Icons given in turn to list items added in the admin panel without one
const ROTATION = ['Sparkles', 'Heart', 'Flower2', 'Sun', 'Leaf', 'Brain', 'Shield', 'Users', 'TrendingUp', 'Moon'];
export const rotatingIcon = (index) => ROTATION[index % ROTATION.length];
