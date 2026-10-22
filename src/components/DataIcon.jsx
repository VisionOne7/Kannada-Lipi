import React from 'react';
import {
    Landmark, Wheat, Waves, PawPrint, Droplet, Droplets, Mountain, MountainSnow, BarChart3, Music, Music2,
    Shirt, Coffee, ScrollText, Lightbulb, House, Bus, BusFront, Car, Trees, TreeDeciduous, TreePine, Hospital,
    Plane, Building2, Building, Castle, Pickaxe, TreePalm, Utensils, UtensilsCrossed, Stethoscope, MapPin,
    Bug, Drama, Tent, Flame, Bird, Cog, Library, Laptop, GraduationCap, PenLine, Medal, Candy, Mountain as Rock,
    Nut, Clapperboard, CloudRain, IdCard, HardHat, Trophy, Users, Ruler, Flower, Flower2, Gem, Shield, Swords,
    Flag, Palette, Amphora, Drum, Soup, Cookie, CakeSlice, Sunrise, Wind, Crown, PartyPopper, Sprout, Microscope,
    Languages, Ship, TrainFront, Route, Wallet, Pin, Construction, ClipboardList, Monitor, Target, ShieldCheck,
    Presentation, TramFront, Zap, Plug, School, Heart, Ambulance, Map, Hotel, FileText, Files, Banknote, Package,
    BookOpen, Milk, Vote, Scale, Megaphone, Sparkles,
} from 'lucide-react';

/**
 * Renders a data file's emoji as a matching Lucide icon, so content files can
 * keep their simple emoji markers while the site shows consistent, professional
 * icons. Unknown values fall back to a neutral sparkle.
 */
const MAP = {
    '🏛': Landmark, '🕌': Landmark, '🛕': Landmark, '⛪': Landmark, '🗿': Landmark, '🕉': Landmark,
    '🌾': Wheat, '🌊': Waves, '💧': Droplet, '💦': Droplets, '⛰': Mountain, '🏔': MountainSnow, '🪨': Rock,
    '🐘': PawPrint, '🐅': PawPrint, '🐯': PawPrint, '🦌': PawPrint, '🐒': PawPrint, '🐃': PawPrint,
    '🐦': Bird, '🦜': Bird, '🦅': Bird, '🦋': Bug,
    '📊': BarChart3, '🎵': Music, '🎶': Music2, '🪈': Music, '🪘': Drum,
    '🧵': Shirt, '☕': Coffee, '📜': ScrollText, '💡': Lightbulb, '🏠': House, '🏘': House,
    '🚌': Bus, '🚍': BusFront, '🚗': Car, '🚂': TrainFront, '🚇': TramFront, '🚢': Ship, '✈': Plane, '🛣': Route,
    '🏞': Trees, '🌳': TreeDeciduous, '🌲': TreePine, '🌿': Sprout, '🌸': Flower, '🪷': Flower2,
    '🥥': TreePalm, '🏖': TreePalm,
    '🏥': Hospital, '🩺': Stethoscope, '🚑': Ambulance, '❤': Heart,
    '🏙': Building2, '🌆': Building2, '🏢': Building, '🏰': Castle, '🏯': Castle, '🌉': Castle,
    '⛏': Pickaxe, '🥇': Medal, '🍬': Candy, '🌰': Nut, '🎬': Clapperboard, '🌧': CloudRain,
    '🍛': UtensilsCrossed, '🫓': Utensils, '🥞': Utensils, '🥟': Utensils, '🥘': Soup, '🥣': Soup,
    '🫕': Cookie, '🍘': Cookie, '🫔': Cookie, '🧁': CakeSlice, '🥛': Milk,
    '📍': MapPin, '🗺': Map, '📌': Pin,
    '💃': Drama, '🎭': Drama, '🎪': Tent, '🎨': Palette, '🏺': Amphora,
    '🔥': Flame, '🌅': Sunrise, '🪁': Wind, '👑': Crown, '🎊': PartyPopper,
    '🔬': Microscope, '⚙': Cog, '📚': Library, '💻': Laptop, '🎓': GraduationCap, '✝': GraduationCap,
    '🗣': Languages, '☪': Languages,
    '📝': PenLine, '🪪': IdCard, '👷': HardHat, '🏆': Trophy, '👥': Users, '📐': Ruler,
    '💎': Gem, '🛡': Shield, '⚔': Swords, '🇮🇳': Flag, '🏁': Flag,
    '💰': Wallet, '🏦': Banknote, '📦': Package, '🏗': Construction, '📋': ClipboardList, '🖥': Monitor,
    '🎯': Target, '👮': ShieldCheck, '👨‍🏫': Presentation,
    '⚡': Zap, '🔌': Plug, '🏫': School, '🏨': Hotel,
    '📄': FileText, '📑': Files, '📖': BookOpen, '🗳': Vote, '⚖': Scale, '📢': Megaphone,
};

// Strip the emoji "variation selector" so 🏛️ and 🏛 match the same entry.
const normalise = (v) => String(v || '').replace(/️/g, '').trim();

export const iconFor = (value) => MAP[normalise(value)] || Sparkles;

const DataIcon = ({ value, size = 20, className = 'data-icon', strokeWidth = 1.8 }) => {
    const Icon = iconFor(value);
    return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
};

export default DataIcon;
