import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import film4 from "@/assets/film-4.jpg";
import film5 from "@/assets/film-5.jpg";
import film6 from "@/assets/film-6.jpg";

export interface Video {
  id: string;
  title: string;
  subtitle?: string;
  director?: string;
  production?: string;
  thumbnail: string;
  videoUrl?: string;
  category: "selected" | "films" | "music-videos" | "commercials";
}

export const selectedVideos: Video[] = [
  {
    id: "1",
    title: "Rosalía - Berghain feat. Björk & Yves Tumor",
    director: "Nicolas Méndez",
    production: "CANADA",
    thumbnail: film1,
    category: "selected",
  },
  {
    id: "2",
    title: "Bonjour Tristesse",
    director: "Durga Chew-Bose",
    production: "Babenation, Elevation Pictures, Cinenovo",
    thumbnail: film2,
    category: "selected",
  },
  {
    id: "3",
    title: "All It Takes Is A Yes - Lufthansa",
    director: "Niclas Larsson",
    production: "Iconoclast",
    thumbnail: film3,
    category: "selected",
  },
  {
    id: "4",
    title: "Miu Miu - Miutine",
    director: "Hailey Benton Gates",
    production: "Psycho",
    thumbnail: film4,
    category: "selected",
  },
  {
    id: "5",
    title: "Mette - Mama's Eyes",
    director: "Camille Summers-Valli",
    production: "Artpractice Studio, Lovesong, Division",
    thumbnail: film5,
    category: "selected",
  },
  {
    id: "6",
    title: "The Golden Hour",
    director: "Marcus Klein",
    production: "Artisan Films",
    thumbnail: film6,
    category: "selected",
  },
];

export const filmVideos: Video[] = [
  {
    id: "f1",
    title: "Bonjour Tristesse",
    thumbnail: film1,
    category: "films",
  },
  {
    id: "f2",
    title: "Harka",
    thumbnail: film2,
    category: "films",
  },
  {
    id: "f3",
    title: "Masterpiece Mommy",
    thumbnail: film3,
    category: "films",
  },
  {
    id: "f4",
    title: "Flint",
    thumbnail: film4,
    category: "films",
  },
  {
    id: "f5",
    title: "Swim Hunt Run",
    thumbnail: film5,
    category: "films",
  },
  {
    id: "f6",
    title: "1608",
    thumbnail: film6,
    category: "films",
  },
];

export const musicVideos: Video[] = [
  {
    id: "mv1",
    title: "Rosalía - Berghain",
    thumbnail: film1,
    category: "music-videos",
  },
  {
    id: "mv2",
    title: "Mette - Mama's Eyes",
    thumbnail: film2,
    category: "music-videos",
  },
  {
    id: "mv3",
    title: "FKA twigs - Cellophane",
    thumbnail: film3,
    category: "music-videos",
  },
  {
    id: "mv4",
    title: "James Blake - Retrograde",
    thumbnail: film4,
    category: "music-videos",
  },
];

export const commercialVideos: Video[] = [
  {
    id: "c1",
    title: "Lufthansa - All It Takes",
    thumbnail: film3,
    category: "commercials",
  },
  {
    id: "c2",
    title: "Miu Miu - Miutine",
    thumbnail: film4,
    category: "commercials",
  },
  {
    id: "c3",
    title: "Apple - Think Different",
    thumbnail: film5,
    category: "commercials",
  },
  {
    id: "c4",
    title: "Nike - Just Do It",
    thumbnail: film6,
    category: "commercials",
  },
];
