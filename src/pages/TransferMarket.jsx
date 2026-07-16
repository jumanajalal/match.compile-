import React, { useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

const PLAYER_POOL = [
  // --- ATTACKERS (1-35) ---
  { id: 1, name: "K. Mbappé", nation: "🇫🇷", pos: "LW", cost: 120, pace: 97, shoot: 90, pass: 80, dribbling: 93, defend: 36, physical: 78, height: 178 },
  { id: 2, name: "E. Haaland", nation: "🇳🇴", pos: "ST", cost: 115, pace: 89, shoot: 93, pass: 65, dribbling: 80, defend: 45, physical: 88, height: 195 },
  { id: 3, name: "H. Kane", nation: "🏴", pos: "ST", cost: 115, pace: 68, shoot: 93, pass: 84, dribbling: 83, defend: 49, physical: 83, height: 188 },
  { id: 4, name: "V. Júnior", nation: "🇧🇷", pos: "LW", cost: 115, pace: 95, shoot: 85, pass: 81, dribbling: 91, defend: 29, physical: 68, height: 176 },
  { id: 5, name: "L. Messi", nation: "🇦🇷", pos: "RW", cost: 110, pace: 86, shoot: 87, pass: 85, dribbling: 92, defend: 33, physical: 64, height: 170 },
  { id: 6, name: "M. Salah", nation: "🇪🇬", pos: "RW", cost: 100, pace: 89, shoot: 87, pass: 81, dribbling: 89, defend: 45, physical: 75, height: 175 },
  { id: 7, name: "L. Martínez", nation: "🇦🇷", pos: "ST", cost: 90, pace: 80, shoot: 86, pass: 75, dribbling: 84, defend: 45, physical: 84, height: 174 },
  { id: 8, name: "B. Saka", nation: "🏴", pos: "RW", cost: 90, pace: 86, shoot: 82, pass: 83, dribbling: 87, defend: 65, physical: 70, height: 178 },
  { id: 9, name: "Rodrygo", nation: "🇧🇷", pos: "RW", cost: 90, pace: 89, shoot: 82, pass: 79, dribbling: 87, defend: 40, physical: 64, height: 174 },
  { id: 10, name: "R. Leão", nation: "🇵🇹", pos: "LW", cost: 85, pace: 93, shoot: 78, pass: 75, dribbling: 88, defend: 27, physical: 76, height: 188 },
  { id: 11, name: "V. Osimhen", nation: "🇳🇬", pos: "ST", cost: 90, pace: 90, shoot: 85, pass: 65, dribbling: 82, defend: 40, physical: 82, height: 186 },
  { id: 12, name: "K. Kvaratskhelia", nation: "🇬🇪", pos: "LW", cost: 85, pace: 88, shoot: 81, pass: 80, dribbling: 89, defend: 40, physical: 72, height: 183 },
  { id: 13, name: "A. Isak", nation: "🇸🇪", pos: "ST", cost: 80, pace: 85, shoot: 82, pass: 73, dribbling: 84, defend: 35, physical: 74, height: 192 },
  { id: 14, name: "V. Gyökeres", nation: "🇸🇪", pos: "ST", cost: 80, pace: 87, shoot: 83, pass: 70, dribbling: 82, defend: 45, physical: 85, height: 187 },
  { id: 15, name: "N. Williams", nation: "🇪🇸", pos: "LW", cost: 85, pace: 94, shoot: 76, pass: 78, dribbling: 89, defend: 35, physical: 68, height: 181 },
  { id: 16, name: "C. Gakpo", nation: "🇳🇱", pos: "LW", cost: 80, pace: 85, shoot: 82, pass: 77, dribbling: 83, defend: 40, physical: 78, height: 193 },
  { id: 17, name: "D. Núñez", nation: "🇺🇾", pos: "ST", cost: 80, pace: 90, shoot: 80, pass: 70, dribbling: 81, defend: 45, physical: 82, height: 187 },
  { id: 18, name: "O. Dembélé", nation: "🇫🇷", pos: "RW", cost: 85, pace: 93, shoot: 77, pass: 82, dribbling: 89, defend: 35, physical: 58, height: 178 },
  { id: 19, name: "L. Yamal", nation: "🇪🇸", pos: "RW", cost: 95, pace: 89, shoot: 80, pass: 82, dribbling: 88, defend: 30, physical: 60, height: 180 },
  { id: 20, name: "J. Álvarez", nation: "🇦🇷", pos: "ST", cost: 85, pace: 84, shoot: 83, pass: 78, dribbling: 83, defend: 55, physical: 75, height: 170 },
  { id: 21, name: "B. Šeško", nation: "🇸🇮", pos: "ST", cost: 75, pace: 84, shoot: 81, pass: 68, dribbling: 78, defend: 40, physical: 77, height: 195 },
  { id: 22, name: "L. Openda", nation: "🇧🇪", pos: "ST", cost: 75, pace: 93, shoot: 80, pass: 70, dribbling: 82, defend: 35, physical: 74, height: 177 },
  { id: 23, name: "J. Doku", nation: "🇧🇪", pos: "LW", cost: 80, pace: 95, shoot: 72, pass: 76, dribbling: 90, defend: 30, physical: 62, height: 171 },
  { id: 24, name: "J. David", nation: "🇨🇦", pos: "ST", cost: 75, pace: 85, shoot: 80, pass: 72, dribbling: 81, defend: 35, physical: 72, height: 180 },
  { id: 25, name: "D. Vlahović", nation: "🇷🇸", pos: "ST", cost: 80, pace: 79, shoot: 83, pass: 66, dribbling: 79, defend: 30, physical: 81, height: 190 },
  { id: 26, name: "A. Lookman", nation: "🇳🇬", pos: "LW", cost: 80, pace: 88, shoot: 81, pass: 75, dribbling: 85, defend: 40, physical: 68, height: 174 },
  { id: 27, name: "B. Mbeumo", nation: "🇨🇲", pos: "RW", cost: 75, pace: 86, shoot: 78, pass: 77, dribbling: 82, defend: 50, physical: 74, height: 171 },
  { id: 28, name: "F. Torres", nation: "🇪🇸", pos: "RW", cost: 75, pace: 82, shoot: 77, pass: 79, dribbling: 81, defend: 40, physical: 70, height: 184 },
  { id: 29, name: "K. Havertz", nation: "🇩🇪", pos: "ST", cost: 80, pace: 81, shoot: 79, pass: 80, dribbling: 81, defend: 50, physical: 77, height: 193 },
  { id: 30, name: "K. Adeyemi", nation: "🇩🇪", pos: "LW", cost: 75, pace: 94, shoot: 75, pass: 72, dribbling: 83, defend: 35, physical: 65, height: 177 },
  { id: 31, name: "J. Félix", nation: "🇵🇹", pos: "CF", cost: 80, pace: 82, shoot: 78, pass: 81, dribbling: 85, defend: 40, physical: 66, height: 181 },
  { id: 32, name: "P. Neto", nation: "🇵🇹", pos: "RW", cost: 75, pace: 90, shoot: 75, pass: 78, dribbling: 86, defend: 35, physical: 65, height: 172 },
  { id: 33, name: "P. Schick", nation: "🇨🇿", pos: "ST", cost: 75, pace: 77, shoot: 81, pass: 70, dribbling: 78, defend: 35, physical: 76, height: 191 },
  { id: 34, name: "A. Sørloth", nation: "🇳🇴", pos: "ST", cost: 75, pace: 78, shoot: 82, pass: 65, dribbling: 75, defend: 40, physical: 88, height: 195 },
  { id: 35, name: "M. Rashford", nation: "🏴", pos: "LW", cost: 80, pace: 88, shoot: 82, pass: 78, dribbling: 84, defend: 38, physical: 75, height: 186 },

  // --- MIDFIELDERS (36+) ---
  { id: 36, name: "Rodri", nation: "🇪🇸", pos: "CDM", cost: 105, pace: 62, shoot: 75, pass: 88, defend: 85, physical: 84 },
  { id: 37, name: "J. Bellingham", nation: "🏴", pos: "CM", cost: 105, pace: 82, shoot: 85, pass: 84, defend: 78, physical: 86 },
  { id: 38, name: "Pedri", nation: "🇪🇸", pos: "CM", cost: 90, pace: 76, shoot: 68, pass: 88, defend: 68, physical: 62 },
  { id: 39, name: "F. Valverde", nation: "🇺🇾", pos: "CM", cost: 95, pace: 88, shoot: 82, pass: 84, defend: 80, physical: 88 },
  { id: 40, name: "F. Wirtz", nation: "🇩🇪", pos: "CAM", cost: 90, pace: 82, shoot: 80, pass: 87, defend: 55, physical: 65 },
  { id: 41, name: "J. Musiala", nation: "🇩🇪", pos: "CAM", cost: 95, pace: 85, shoot: 82, pass: 84, defend: 60, physical: 65 },
  { id: 42, name: "K. De Bruyne", nation: "🇧🇪", pos: "CAM", cost: 100, pace: 72, shoot: 85, pass: 94, defend: 65, physical: 74 },
  { id: 43, name: "B. Fernandes", nation: "🇵🇹", pos: "CAM", cost: 90, pace: 72, shoot: 86, pass: 90, defend: 65, physical: 70 },
  { id: 44, name: "B. Silva", nation: "🇵🇹", pos: "CM", cost: 90, pace: 75, shoot: 78, pass: 89, defend: 65, physical: 60 },
  { id: 45, name: "M. Ødegaard", nation: "🇳🇴", pos: "CAM", cost: 90, pace: 74, shoot: 81, pass: 89, defend: 58, physical: 62 },
  { id: 46, name: "D. Rice", nation: "🏴", pos: "CDM", cost: 85, pace: 73, shoot: 70, pass: 82, defend: 85, physical: 82 },
  { id: 47, name: "N. Barella", nation: "🇮🇹", pos: "CM", cost: 85, pace: 78, shoot: 75, pass: 84, defend: 80, physical: 82 },
  { id: 48, name: "A. Mac Allister", nation: "🇦🇷", pos: "CM", cost: 85, pace: 72, shoot: 78, pass: 84, defend: 75, physical: 76 },
  { id: 49, name: "Enzo F.", nation: "🇦🇷", pos: "CM", cost: 80, pace: 74, shoot: 76, pass: 85, defend: 77, physical: 80 },
  { id: 50, name: "Vitinha", nation: "🇵🇹", pos: "CM", cost: 85, pace: 78, shoot: 75, pass: 86, defend: 70, physical: 68 },
  { id: 51, name: "A. Tchouaméni", nation: "🇫🇷", pos: "CDM", cost: 85, pace: 74, shoot: 72, pass: 82, defend: 84, physical: 83 },
  { id: 52, name: "E. Camavinga", nation: "🇫🇷", pos: "CM", cost: 80, pace: 80, shoot: 68, pass: 82, defend: 80, physical: 78 },
  { id: 53, name: "J. Kimmich", nation: "🇩🇪", pos: "CDM", cost: 85, pace: 70, shoot: 75, pass: 88, defend: 82, physical: 76 },
  { id: 54, name: "L. Modrić", nation: "🇭🇷", pos: "CM", cost: 75, pace: 65, shoot: 76, pass: 89, defend: 70, physical: 62 },
  { id: 55, name: "F. de Jong", nation: "🇳🇱", pos: "CM", cost: 85, pace: 79, shoot: 68, pass: 88, defend: 76, physical: 77 },
  { id: 56, name: "H. Çalhanoğlu", nation: "🇹🇷", pos: "CM", cost: 80, pace: 68, shoot: 84, pass: 86, defend: 72, physical: 69 },
  { id: 57, name: "T. Reijnders", nation: "🇳🇱", pos: "CM", cost: 80, pace: 82, shoot: 74, pass: 81, defend: 72, physical: 75 },
  { id: 58, name: "D. Szoboszlai", nation: "🇭🇺", pos: "CAM", cost: 80, pace: 84, shoot: 80, pass: 82, defend: 62, physical: 74 },
  { id: 59, name: "Dani Olmo", nation: "🇪🇸", pos: "CAM", cost: 85, pace: 78, shoot: 81, pass: 85, defend: 50, physical: 60 },
  { id: 60, name: "Mikel Merino", nation: "🇪🇸", pos: "CM", cost: 80, pace: 72, shoot: 75, pass: 82, defend: 80, physical: 84 },
  { id: 61, name: "João Neves", nation: "🇵🇹", pos: "CM", cost: 80, pace: 76, shoot: 65, pass: 83, defend: 78, physical: 75 },
  { id: 62, name: "R. Gravenberch", nation: "🇳🇱", pos: "CM", cost: 75, pace: 78, shoot: 72, pass: 80, defend: 75, physical: 78 },
  { id: 63, name: "A. Rabiot", nation: "🇫🇷", pos: "CM", cost: 80, pace: 75, shoot: 74, pass: 80, defend: 78, physical: 82 },
  { id: 64, name: "Y. Tielemans", nation: "🇧🇪", pos: "CM", cost: 75, pace: 68, shoot: 80, pass: 84, defend: 70, physical: 72 },
  { id: 65, name: "S. Amrabat", nation: "🇲🇦", pos: "CDM", cost: 75, pace: 68, shoot: 60, pass: 76, defend: 82, physical: 85 },
  { id: 66, name: "I. Saibari", nation: "🇲🇦", pos: "CAM", cost: 70, pace: 80, shoot: 75, pass: 78, defend: 55, physical: 76 },
  { id: 67, name: "Ederson", nation: "🇧🇷", pos: "CM", cost: 75, pace: 76, shoot: 72, pass: 78, defend: 80, physical: 82 },
  { id: 68, name: "Gavi", nation: "🇪🇸", pos: "CM", cost: 80, pace: 78, shoot: 68, pass: 82, defend: 75, physical: 70 },
  { id: 69, name: "C. Gallagher", nation: "🏴", pos: "CM", cost: 75, pace: 78, shoot: 72, pass: 76, defend: 78, physical: 82 },
  { id: 70, name: "W. Zaïre-Emery", nation: "🇫🇷", pos: "CM", cost: 80, pace: 80, shoot: 70, pass: 81, defend: 76, physical: 75 },
  { id: 71, name: "Pascal Groß", nation: "🇩🇪", pos: "CM", cost: 75, pace: 65, shoot: 74, pass: 85, defend: 72, physical: 70 },
  { id: 72, name: "Xavi Simons", nation: "🇳🇱", pos: "CAM", cost: 85, pace: 86, shoot: 80, pass: 84, defend: 50, physical: 65 },

  // --- DEFENDERS (73-112) ---
  { id: 73, name: "V. van Dijk", nation: "🇳🇱", pos: "CB", cost: 105, pace: 75, shoot: 60, pass: 71, defend: 90, physical: 88 },
  { id: 74, name: "W. Saliba", nation: "🇫🇷", pos: "CB", cost: 100, pace: 82, shoot: 45, pass: 72, defend: 88, physical: 84 },
  { id: 75, name: "R. Dias", nation: "🇵🇹", pos: "CB", cost: 100, pace: 65, shoot: 40, pass: 70, defend: 89, physical: 87 },
  { id: 76, name: "A. Rüdiger", nation: "🇩🇪", pos: "CB", cost: 95, pace: 82, shoot: 50, pass: 71, defend: 86, physical: 86 },
  { id: 77, name: "A. Bastoni", nation: "🇮🇹", pos: "CB", cost: 95, pace: 74, shoot: 42, pass: 83, defend: 87, physical: 83 },
  { id: 78, name: "J. Gvardiol", nation: "🇭🇷", pos: "CB", cost: 95, pace: 80, shoot: 64, pass: 79, defend: 85, physical: 84 },
  { id: 79, name: "A. Hakimi", nation: "🇲🇦", pos: "RB", cost: 95, pace: 92, shoot: 75, pass: 82, defend: 78, physical: 76 },
  { id: 80, name: "R. Araújo", nation: "🇺🇾", pos: "CB", cost: 90, pace: 84, shoot: 52, pass: 65, defend: 87, physical: 86 },
  { id: 81, name: "T. Hernández", nation: "🇫🇷", pos: "LB", cost: 95, pace: 94, shoot: 72, pass: 80, defend: 80, physical: 82 },
  { id: 82, name: "J. Koundé", nation: "🇫🇷", pos: "RB", cost: 90, pace: 84, shoot: 50, pass: 76, defend: 85, physical: 79 },
  { id: 83, name: "T. Alexander-Arnold", nation: "🏴", pos: "RB", cost: 90, pace: 76, shoot: 72, pass: 90, defend: 77, physical: 74 },
  { id: 84, name: "Nuno Mendes", nation: "🇵🇹", pos: "LB", cost: 85, pace: 92, shoot: 65, pass: 78, defend: 79, physical: 75 },
  { id: 85, name: "A. Davies", nation: "🇨🇦", pos: "LB", cost: 85, pace: 95, shoot: 68, pass: 77, defend: 76, physical: 77 },
  { id: 86, name: "Gabriel M.", nation: "🇧🇷", pos: "CB", cost: 85, pace: 72, shoot: 45, pass: 68, defend: 86, physical: 85 },
  { id: 87, name: "É. Militão", nation: "🇧🇷", pos: "CB", cost: 85, pace: 85, shoot: 50, pass: 70, defend: 85, physical: 82 },
  { id: 88, name: "Marquinhos", nation: "🇧🇷", pos: "CB", cost: 85, pace: 78, shoot: 55, pass: 76, defend: 86, physical: 80 },
  { id: 89, name: "C. Romero", nation: "🇦🇷", pos: "CB", cost: 85, pace: 76, shoot: 45, pass: 66, defend: 86, physical: 86 },
  { id: 90, name: "Kim Min-jae", nation: "🇰🇷", pos: "CB", cost: 85, pace: 80, shoot: 40, pass: 68, defend: 86, physical: 85 },
  { id: 91, name: "N. Aké", nation: "🇳🇱", pos: "CB", cost: 80, pace: 75, shoot: 50, pass: 76, defend: 84, physical: 80 },
  { id: 92, name: "J. Frimpong", nation: "🇳🇱", pos: "RB", cost: 85, pace: 94, shoot: 74, pass: 80, defend: 75, physical: 72 },
  { id: 93, name: "D. Upamecano", nation: "🇫🇷", pos: "CB", cost: 80, pace: 84, shoot: 45, pass: 70, defend: 82, physical: 84 },
  { id: 94, name: "R. Calafiori", nation: "🇮🇹", pos: "CB", cost: 80, pace: 76, shoot: 55, pass: 78, defend: 83, physical: 79 },
  { id: 95, name: "A. Grimaldo", nation: "🇪🇸", pos: "LB", cost: 85, pace: 84, shoot: 78, pass: 86, defend: 76, physical: 70 },
  { id: 96, name: "M. Cucurella", nation: "🇪🇸", pos: "LB", cost: 80, pace: 82, shoot: 60, pass: 76, defend: 80, physical: 76 },
  { id: 97, name: "R. Le Normand", nation: "🇪🇸", pos: "CB", cost: 80, pace: 72, shoot: 45, pass: 70, defend: 83, physical: 82 },
  { id: 98, name: "J. Cancelo", nation: "🇵🇹", pos: "RB", cost: 80, pace: 82, shoot: 72, pass: 85, defend: 77, physical: 72 },
  { id: 99, name: "L. Martínez", nation: "🇦🇷", pos: "CB", cost: 80, pace: 74, shoot: 50, pass: 78, defend: 84, physical: 82 },
  { id: 100, name: "N. Molina", nation: "🇦🇷", pos: "RB", cost: 75, pace: 86, shoot: 62, pass: 76, defend: 76, physical: 74 },
  { id: 101, name: "D. Hancko", nation: "🇸🇰", pos: "CB", cost: 75, pace: 76, shoot: 58, pass: 75, defend: 81, physical: 78 },
  { id: 102, name: "J. Tah", nation: "🇩🇪", pos: "CB", cost: 75, pace: 74, shoot: 40, pass: 65, defend: 82, physical: 86 },
  { id: 103, name: "M. van de Ven", nation: "🇳🇱", pos: "CB", cost: 80, pace: 90, shoot: 45, pass: 72, defend: 82, physical: 82 },
  { id: 104, name: "L. Colwill", nation: "🏴", pos: "CB", cost: 75, pace: 74, shoot: 45, pass: 74, defend: 80, physical: 78 },
  { id: 105, name: "R. James", nation: "🏴", pos: "RB", cost: 80, pace: 80, shoot: 70, pass: 84, defend: 82, physical: 82 },
  { id: 106, name: "P. Hincapié", nation: "🇪🇨", pos: "CB", cost: 75, pace: 79, shoot: 48, pass: 72, defend: 81, physical: 77 },
  { id: 107, name: "C. Lukeba", nation: "🇫🇷", pos: "CB", cost: 70, pace: 78, shoot: 40, pass: 68, defend: 78, physical: 76 },
  { id: 108, name: "I. Maatsen", nation: "🇳🇱", pos: "LB", cost: 75, pace: 88, shoot: 64, pass: 76, defend: 74, physical: 68 },
  { id: 109, name: "L. Geertruida", nation: "🇳🇱", pos: "RB", cost: 75, pace: 82, shoot: 55, pass: 76, defend: 78, physical: 80 },
  { id: 110, name: "O. Zinchenko", nation: "🇺🇦", pos: "LB", cost: 75, pace: 72, shoot: 66, pass: 84, defend: 75, physical: 66 },
  { id: 111, name: "K. Walker", nation: "🏴", pos: "RB", cost: 80, pace: 90, shoot: 60, pass: 75, defend: 80, physical: 82 },
  { id: 112, name: "N. Tagliafico", nation: "🇦🇷", pos: "LB", cost: 75, pace: 78, shoot: 55, pass: 72, defend: 78, physical: 76 },

  // --- GOALKEEPERS (113-140) ---
  { id: 113, name: "T. Courtois", nation: "🇧🇪", pos: "GK", cost: 95, diving: 90, handling: 89, kicking: 75, reflexes: 92, positioning: 91, height: 200 },
  { id: 114, name: "Alisson", nation: "🇧🇷", pos: "GK", cost: 95, diving: 89, handling: 88, kicking: 82, reflexes: 90, positioning: 90, height: 193 },
  { id: 115, name: "M. ter Stegen", nation: "🇩🇪", pos: "GK", cost: 90, diving: 88, handling: 87, kicking: 88, reflexes: 89, positioning: 88, height: 187 },
  { id: 116, name: "J. Oblak", nation: "🇸🇮", pos: "GK", cost: 90, diving: 89, handling: 88, kicking: 68, reflexes: 90, positioning: 89, height: 188 },
  { id: 117, name: "G. Donnarumma", nation: "🇮🇹", pos: "GK", cost: 90, diving: 89, handling: 87, kicking: 74, reflexes: 90, positioning: 88, height: 196 },
  { id: 118, name: "E. Martínez", nation: "🇦🇷", pos: "GK", cost: 90, diving: 87, handling: 86, kicking: 70, reflexes: 89, positioning: 88, height: 195 },
  { id: 119, name: "M. Maignan", nation: "🇫🇷", pos: "GK", cost: 90, diving: 88, handling: 87, kicking: 75, reflexes: 89, positioning: 87, height: 191 },
  { id: 120, name: "G. Kobel", nation: "🇨🇭", pos: "GK", cost: 85, diving: 86, handling: 85, kicking: 72, reflexes: 87, positioning: 86, height: 195 },
  { id: 121, name: "D. Costa", nation: "🇵🇹", pos: "GK", cost: 85, diving: 85, handling: 84, kicking: 80, reflexes: 86, positioning: 85, height: 186 },
  { id: 122, name: "Y. Bounou", nation: "🇲🇦", pos: "GK", cost: 85, diving: 86, handling: 85, kicking: 68, reflexes: 87, positioning: 86, height: 192 },
  { id: 123, name: "D. Raya", nation: "🇪🇸", pos: "GK", cost: 85, diving: 85, handling: 84, kicking: 86, reflexes: 85, positioning: 85, height: 183 },
  { id: 124, name: "U. Simón", nation: "🇪🇸", pos: "GK", cost: 85, diving: 84, handling: 83, kicking: 78, reflexes: 85, positioning: 84, height: 190 },
  { id: 125, name: "J. Pickford", nation: "🏴", pos: "GK", cost: 80, diving: 84, handling: 82, kicking: 82, reflexes: 84, positioning: 83, height: 185 },
  { id: 126, name: "G. Mamardashvili", nation: "🇬🇪", pos: "GK", cost: 80, diving: 85, handling: 84, kicking: 65, reflexes: 86, positioning: 84, height: 197 },
  { id: 127, name: "D. Livaković", nation: "🇭🇷", pos: "GK", cost: 80, diving: 83, handling: 82, kicking: 66, reflexes: 84, positioning: 83, height: 188 },
  { id: 128, name: "B. Verbruggen", nation: "🇳🇱", pos: "GK", cost: 80, diving: 82, handling: 81, kicking: 80, reflexes: 83, positioning: 82, height: 194 },
  { id: 129, name: "A. Onana", nation: "🇨🇲", pos: "GK", cost: 80, diving: 81, handling: 80, kicking: 88, reflexes: 82, positioning: 81, height: 190 },
  { id: 130, name: "A. Lunin", nation: "🇺🇦", pos: "GK", cost: 80, diving: 83, handling: 82, kicking: 75, reflexes: 84, positioning: 83, height: 191 },
  { id: 131, name: "K. Casteels", nation: "🇧🇪", pos: "GK", cost: 75, diving: 82, handling: 81, kicking: 72, reflexes: 83, positioning: 82, height: 197 },
  { id: 132, name: "L. Chevalier", nation: "🇫🇷", pos: "GK", cost: 75, diving: 81, handling: 80, kicking: 74, reflexes: 82, positioning: 81, height: 189 },
  { id: 133, name: "A. Trubin", nation: "🇺🇦", pos: "GK", cost: 75, diving: 80, handling: 79, kicking: 70, reflexes: 81, positioning: 80, height: 199 },
  { id: 134, name: "G. Ochoa", nation: "🇲🇽", pos: "GK", cost: 75, diving: 80, handling: 79, kicking: 65, reflexes: 81, positioning: 80, height: 185 },
  { id: 135, name: "K. Schmeichel", nation: "🇩🇰", pos: "GK", cost: 70, diving: 78, handling: 77, kicking: 76, reflexes: 79, positioning: 78, height: 189 },
  { id: 136, name: "M. Turner", nation: "🇺🇸", pos: "GK", cost: 70, diving: 77, handling: 76, kicking: 65, reflexes: 78, positioning: 77, height: 191 },
  { id: 137, name: "D. Petrović", nation: "🇷🇸", pos: "GK", cost: 70, diving: 78, handling: 77, kicking: 68, reflexes: 79, positioning: 78, height: 194 },
  { id: 138, name: "Ł. Skorupski", nation: "🇵🇱", pos: "GK", cost: 70, diving: 77, handling: 76, kicking: 66, reflexes: 78, positioning: 77, height: 187 },
  { id: 139, name: "P. Rajković", nation: "🇷🇸", pos: "GK", cost: 70, diving: 77, handling: 76, kicking: 65, reflexes: 78, positioning: 77, height: 191 },
  { id: 140, name: "R. Williams", nation: "🇿🇦", pos: "GK", cost: 70, diving: 76, handling: 75, kicking: 72, reflexes: 77, positioning: 76, height: 184 },

  {
  id: 141,
  name: "C. Ronaldo",
  nation: "🇵🇹",
  pos: "ST",
  cost: 100,
  pace: 80,
  shoot: 92,
  pass: 78,
  dribbling: 84,
  defend: 35,
  physical: 82,
  height: 187
},
  // --- LEGENDS / SUPER SUBS (201-211) ---
  { id: 201, name: "Pelé", nation: "🇧🇷", pos: "ST", cost: 150, pace: 95, shoot: 98, pass: 92, dribbling: 95, defend: 50, physical: 85, height: 173 },
  { id: 202, name: "D. Maradona", nation: "🇦🇷", pos: "CAM", cost: 150, pace: 92, shoot: 95, pass: 97, dribbling: 98, defend: 40, physical: 75, height: 165 },
  { id: 203, name: "Z. Zidane", nation: "🇫🇷", pos: "CAM", cost: 140, pace: 85, shoot: 90, pass: 96, dribbling: 92, defend: 65, physical: 80, height: 185 },
  { id: 204, name: "Ronaldo Nazário", nation: "🇧🇷", pos: "ST", cost: 145, pace: 96, shoot: 97, pass: 75, dribbling: 95, defend: 30, physical: 85, height: 183 },
  { id: 205, name: "J. Cruyff", nation: "🇳🇱", pos: "CF", cost: 135, pace: 90, shoot: 92, pass: 95, dribbling: 94, defend: 50, physical: 70, height: 180 },
  { id: 206, name: "Ronaldinho", nation: "🇧🇷", pos: "CAM", cost: 130, pace: 90, shoot: 92, pass: 96, dribbling: 96, defend: 35, physical: 75, height: 182 },
  { id: 207, name: "F. Beckenbauer", nation: "🇩🇪", pos: "CB", cost: 125, pace: 85, shoot: 80, pass: 92, dribbling: 85, defend: 96, physical: 85, height: 181 },
  { id: 208, name: "G. Müller", nation: "🇩🇪", pos: "ST", cost: 120, pace: 80, shoot: 98, pass: 70, dribbling: 82, defend: 30, physical: 80, height: 176 },
  { id: 209, name: "M. Platini", nation: "🇫🇷", pos: "CAM", cost: 125, pace: 80, shoot: 92, pass: 96, dribbling: 90, defend: 50, physical: 65, height: 177 },
  { id: 210, name: "F. Puskás", nation: "🇭🇺", pos: "ST", cost: 120, pace: 82, shoot: 99, pass: 85, dribbling: 89, defend: 35, physical: 75, height: 172 },
  { id: 211, name: "Lev Yashin", nation: "🇷🇺", pos: "GK", cost: 130, diving: 96, handling: 95, kicking: 80, reflexes: 98, positioning: 99, height: 189 },

  // --- MANAGERS ---
  { id: "M1", name: "Sir Alex Ferguson", buffDesc: "Fergie Time (+10% Squad OVR)", multiplier: 1.10, cost: 80 },
  { id: "M2", name: "Pep Guardiola", buffDesc: "Tiki-Taka (+8% Squad OVR)", multiplier: 1.08, cost: 90 },
  { id: "M3", name: "Carlo Ancelotti", buffDesc: "Don Carlo (+5% Squad OVR)", multiplier: 1.05, cost: 95 },
  { id: "M4", name: "Johan Cruyff", buffDesc: "Total Football (+8% Squad OVR)", multiplier: 1.08, cost: 85 }
];

const FIELD_MAX = 11;
const MAX_BUDGET = 1250;

// Formation definitions -- GK is always 1, implicit
const FORMATIONS = {
  '4-3-3': { DEF: 4, MID: 3, FWD: 3 },
  '4-4-2': { DEF: 4, MID: 4, FWD: 2 },
  '4-2-3-1': { DEF: 4, MID: 5, FWD: 1 },
  '3-5-2': { DEF: 3, MID: 5, FWD: 2 },
  '3-4-3': { DEF: 3, MID: 4, FWD: 3 },
  '5-3-2': { DEF: 5, MID: 3, FWD: 2 },
};

const isLegend = (p) => typeof p.id === 'number' && p.id >= 201 && p.id <= 211;
const isManager = (p) => typeof p.id === 'string' && p.id.startsWith('M');
const isRegular = (p) => typeof p.id === 'number' && p.id < 200;

// Which line a player belongs to, for formation + pitch placement
const posGroup = (p) => {
  if (p.pos === 'GK') return 'GK';
  if (['CB', 'LB', 'RB'].includes(p.pos)) return 'DEF';
  if (['CAM', 'CM', 'CDM'].includes(p.pos)) return 'MID';
  return 'FWD'; // ST, LW, RW, CF
};

const groupLabel = { GK: 'Goalkeeper', DEF: 'Defence', MID: 'Midfield', FWD: 'Attack' };

function buildSlots(formationKey) {
  const f = FORMATIONS[formationKey];
  const lines = [
    { group: 'FWD', count: f.FWD, y: 12 },
    { group: 'MID', count: f.MID, y: 42 },
    { group: 'DEF', count: f.DEF, y: 68 },
    { group: 'GK', count: 1, y: 90 },
  ];
  const slots = [];
  lines.forEach(line => {
    for (let i = 0; i < line.count; i++) {
      const x = ((i + 1) / (line.count + 1)) * 100;
      slots.push({ id: `${line.group}-${i}`, group: line.group, x, y: line.y });
    }
  });
  return slots;
}

function calculateOVR(p) {
  let ovr = 0;
  if (p.pos === 'GK') {
    ovr = (p.diving * 0.25) + (p.reflexes * 0.25) + (p.positioning * 0.25) + (p.handling * 0.15) + (p.kicking * 0.1);
    if (p.height > 185) ovr *= 1.03;
  } else if (['ST', 'LW', 'RW', 'CF'].includes(p.pos)) {
    ovr = (p.shoot * 0.3) + (p.dribbling * 0.3) + (p.pace * 0.2) + (p.pass * 0.15) + (p.physical * 0.05);
  } else if (['CAM', 'CM', 'CDM'].includes(p.pos)) {
    ovr = (p.pass * 0.4) + (p.shoot * 0.2) + (p.pace * 0.2) + (p.defend * 0.2);
  } else if (['CB', 'LB', 'RB'].includes(p.pos)) {
    ovr = (p.defend * 0.4) + (p.physical * 0.3) + (p.pace * 0.2) + (p.pass * 0.1);
  }
  return ovr;
}

// --- small reusable bits ---

function OutfieldHeader() {
  return (
    <tr>
      <th className="p-4 font-normal">Player</th>
      <th className="p-4 font-normal">Pos</th>
      <th className="p-4 font-normal">Cost</th>
      <th className="p-4 text-center">PAC</th>
      <th className="p-4 text-center">SHO</th>
      <th className="p-4 text-center">PAS</th>
      <th className="p-4 text-center">DRI</th>
      <th className="p-4 text-center">DEF</th>
      <th className="p-4 text-center">PHY</th>
      <th className="p-4 text-right font-normal">Action</th>
    </tr>
  );
}

function GKHeader() {
  return (
    <tr>
      <th className="p-4 font-normal">Player</th>
      <th className="p-4 font-normal">Pos</th>
      <th className="p-4 font-normal">Cost</th>
      <th className="p-4 text-center">DIV</th>
      <th className="p-4 text-center">HAN</th>
      <th className="p-4 text-center">KIC</th>
      <th className="p-4 text-center">REF</th>
      <th className="p-4 text-center">POS</th>
      <th className="p-4 text-center">HT</th>
      <th className="p-4 text-right font-normal">Action</th>
    </tr>
  );
}

function PlayerRow({ p, isSelected, disabled, onToggle, gk }) {
  return (
    <tr className={`hover:bg-gray-900/20 transition-colors ${isSelected ? 'opacity-50' : ''}`}>
      <td className="p-4">
        <div className="text-white font-bold">{p.name}</div>
        <div className="text-[9px] text-gray-600 tracking-normal font-sans lowercase">{p.nation}</div>
      </td>
      <td className="p-4">
        <span className="bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-[9px] text-gray-400">{p.pos}</span>
      </td>
      <td className="p-4 text-[#1E3A8A] font-bold">${p.cost}M</td>
      {gk ? (
        <>
          <td className="p-4 text-center">{p.diving}</td>
          <td className="p-4 text-center">{p.handling}</td>
          <td className="p-4 text-center">{p.kicking}</td>
          <td className="p-4 text-center">{p.reflexes}</td>
          <td className="p-4 text-center">{p.positioning}</td>
          <td className="p-4 text-center">{p.height}</td>
        </>
      ) : (
        <>
          <td className="p-4 text-center">{p.pace}</td>
          <td className="p-4 text-center">{p.shoot}</td>
          <td className="p-4 text-center">{p.pass}</td>
          <td className="p-4 text-center">{p.dribbling}</td>
          <td className="p-4 text-center">{p.defend}</td>
          <td className="p-4 text-center">{p.physical}</td>
        </>
      )}
      <td className="p-4 text-right">
        <button
          disabled={disabled && !isSelected}
          onClick={() => onToggle(p)}
          className={`px-3 py-1.5 rounded border text-[9px] font-bold tracking-widest ${
            isSelected
              ? 'border-gray-700 text-gray-500 hover:border-red-500 hover:text-red-500'
              : disabled
              ? 'border-gray-800 text-gray-700 cursor-not-allowed'
              : 'border-[#1E3A8A]/50 text-[#1E3A8A] hover:bg-[#1E3A8A]/10'
          }`}
        >
          {isSelected ? 'Remove' : 'Draft'}
        </button>
      </td>
    </tr>
  );
}

// A clean, reusable micro-component for the 2x3 stat grid
function Stat({ title, value }) {
  return (
    <div className="flex flex-col bg-black/50 rounded p-1.5 items-center justify-center border border-gray-800/50">
      <span className="text-[9px] text-gray-500 uppercase tracking-widest">{title}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

// The FC Mobile style card for mobile views
function PlayerCard({ p, isSelected, disabled, onToggle, gk }) {
  return (
    <div className={`bg-[#060608] border rounded-xl p-4 mb-3 shadow-lg transition-all ${
      isSelected 
        ? 'border-emerald-500/50 opacity-60' 
        : 'border-gray-800'
    }`}>
      
      {/* Top Row: Name, Nation, Pos */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-bold text-base leading-tight">{p.name}</h3>
          <p className="text-gray-500 text-[10px] tracking-wide uppercase mt-0.5">{p.nation}</p>
        </div>
        <span className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-[10px] font-bold text-gray-300">
          {p.pos}
        </span>
      </div>

      {/* Middle Row: Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {gk ? (
          <>
            <Stat title="DIV" value={p.diving} />
            <Stat title="HAN" value={p.handling} />
            <Stat title="KIC" value={p.kicking} />
            <Stat title="REF" value={p.reflexes} />
            <Stat title="POS" value={p.positioning} />
            <Stat title="HT" value={`${p.height}cm`} />
          </>
        ) : (
          <>
            <Stat title="PAC" value={p.pace} />
            <Stat title="SHO" value={p.shoot} />
            <Stat title="PAS" value={p.pass} />
            <Stat title="DRI" value={p.dribbling} />
            <Stat title="DEF" value={p.defend} />
            <Stat title="PHY" value={p.physical} />
          </>
        )}
      </div>

      {/* Bottom Row: Cost and Action Button */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Cost</div>
          <div className="text-[#1E3A8A] font-bold text-sm">${p.cost}M</div>
        </div>

        <button
          disabled={disabled && !isSelected}
          onClick={() => onToggle(p)}
          className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${
            isSelected
              ? 'bg-red-500/10 text-red-500 border border-red-500/50'
              : disabled
              ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
              : 'bg-[#1E3A8A] text-white hover:bg-blue-800'
          }`}
        >
          {isSelected ? 'Remove' : 'Draft'}
        </button>
      </div>

    </div>
  );
}

export default function TransferMarket() {
  const [fieldSquad, setFieldSquad] = useState([]);   // up to 11 outfield/GK players
  const [superSub, setSuperSub] = useState(null);       // exactly 0 or 1 legend
  const [manager, setManager] = useState(null);         // exactly 0 or 1 manager
  const [marketTab, setMarketTab] = useState('ALL');
  const [formationKey, setFormationKey] = useState('4-3-3');
  const [slotAssignments, setSlotAssignments] = useState({}); // slotId -> playerId
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const slots = useMemo(() => buildSlots(formationKey), [formationKey]);
  const requiredCounts = useMemo(() => ({ GK: 1, ...FORMATIONS[formationKey] }), [formationKey]);

  const currentCost = fieldSquad.reduce((sum, p) => sum + p.cost, 0)
    + (superSub ? superSub.cost : 0)
    + (manager ? manager.cost : 0);
  const remainingBudget = MAX_BUDGET - currentCost;
  const totalSlots = fieldSquad.length + (superSub ? 1 : 0) + (manager ? 1 : 0);

  const totalOVR = (() => {
    let base = fieldSquad.reduce((sum, p) => sum + calculateOVR(p), 0);
    if (superSub) base += calculateOVR(superSub) * 2.0;
    if (manager) base *= manager.multiplier;
    return Math.round(base);
  })();

  // how many of the current 11 belong to each line, vs. what the formation needs
  const groupCounts = fieldSquad.reduce((acc, p) => {
    const g = posGroup(p);
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const formationMatches = ['GK', 'DEF', 'MID', 'FWD'].every(g => (groupCounts[g] || 0) === requiredCounts[g]);

  const assignToFirstOpenSlot = (player, assignments) => {
    const group = posGroup(player);
    const openSlot = slots.find(s => s.group === group && !assignments[s.id]);
    if (!openSlot) return assignments;
    return { ...assignments, [openSlot.id]: player.id };
  };

  const clearAssignment = (playerId, assignments) => {
    const next = { ...assignments };
    Object.keys(next).forEach(k => { if (next[k] === playerId) delete next[k]; });
    return next;
  };

  const toggleFieldPlayer = (player) => {
    const already = fieldSquad.find(p => p.id === player.id);
    if (already) {
      setFieldSquad(fieldSquad.filter(p => p.id !== player.id));
      setSlotAssignments(prev => clearAssignment(player.id, prev));
      if (selectedPlayerId === player.id) setSelectedPlayerId(null);
      return;
    }
    if (fieldSquad.length >= FIELD_MAX) return;
    if (remainingBudget < player.cost) return;
    setFieldSquad([...fieldSquad, player]);
    setSlotAssignments(prev => assignToFirstOpenSlot(player, prev));
  };

  const toggleSuperSub = (player) => {
    if (superSub && superSub.id === player.id) { setSuperSub(null); return; }
    if (!superSub && remainingBudget < player.cost) return;
    if (superSub) {
      // swapping supersub: refund old cost implicitly since it's replaced
      setSuperSub(player);
    } else {
      setSuperSub(player);
    }
  };

  const toggleManager = (mgr) => {
    if (manager && manager.id === mgr.id) { setManager(null); return; }
    if (!manager && remainingBudget < mgr.cost) return;
    setManager(mgr);
  };

  const handleToggle = (p) => {
    if (isManager(p)) return toggleManager(p);
    if (isLegend(p)) return toggleSuperSub(p);
    return toggleFieldPlayer(p);
  };

  const changeFormation = (key) => {
    setFormationKey(key);
    // re-map existing squad into the new slot layout, best effort
    const newSlots = buildSlots(key);
    let next = {};
    fieldSquad.forEach(p => {
      const group = posGroup(p);
      const openSlot = newSlots.find(s => s.group === group && !next[s.id]);
      if (openSlot) next[openSlot.id] = p.id;
    });
    setSlotAssignments(next);
    setSelectedPlayerId(null);
  };

  const handleBenchClick = (playerId) => {
    setSelectedPlayerId(prev => (prev === playerId ? null : playerId));
  };

  const handleSlotClick = (slot) => {
    const occupantId = slotAssignments[slot.id];
    if (!selectedPlayerId) {
      if (occupantId) setSelectedPlayerId(occupantId);
      return;
    }
    const selectedPlayer = fieldSquad.find(p => p.id === selectedPlayerId);
    if (!selectedPlayer) { setSelectedPlayerId(null); return; }
    if (posGroup(selectedPlayer) !== slot.group) return; // wrong line, ignore
    setSlotAssignments(prev => {
      let next = clearAssignment(selectedPlayerId, prev);
      next = { ...next, [slot.id]: selectedPlayerId };
      return next;
    });
    setSelectedPlayerId(null);
  };

  const resetSquad = () => {
    setFieldSquad([]);
    setSuperSub(null);
    setManager(null);
    setSlotAssignments({});
    setSelectedPlayerId(null);
    setSubmitted(false);
    setSubmitError(null);
  };

  const canSubmit = fieldSquad.length === FIELD_MAX && superSub && manager && remainingBudget >= 0 && formationMatches
    && Object.keys(slotAssignments).length === FIELD_MAX;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('You need to be signed in to submit.');

      const { error } = await supabase
        .from('transfer_market_submissions')
        .upsert(
          {
            participant_id: user.id,
            round_name: 'transfer_market',
            formation: formationKey,
            field_squad: fieldSquad.map(p => p.id),
            slot_assignments: slotAssignments,
            super_sub_id: superSub.id,
            manager_id: manager.id,
            total_ovr: totalOVR,
            budget_used: currentCost,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'participant_id,round_name' }
        );

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong submitting your squad.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- market filtering ---
  const outfieldPool = PLAYER_POOL.filter(isRegular).filter(p => p.pos !== 'GK');
  const gkPool = PLAYER_POOL.filter(isRegular).filter(p => p.pos === 'GK');
  const legendOutfield = PLAYER_POOL.filter(isLegend).filter(p => p.pos !== 'GK');
  const legendGK = PLAYER_POOL.filter(isLegend).filter(p => p.pos === 'GK');
  const managerPool = PLAYER_POOL.filter(isManager);

  const marketList = (() => {
    if (marketTab === 'ALL') return outfieldPool;
    if (marketTab === 'FWD') return outfieldPool.filter(p => ['ST', 'LW', 'RW', 'CF'].includes(p.pos));
    if (marketTab === 'MID') return outfieldPool.filter(p => ['CAM', 'CM', 'CDM'].includes(p.pos));
    if (marketTab === 'DEF') return outfieldPool.filter(p => ['CB', 'LB', 'RB'].includes(p.pos));
    if (marketTab === 'GK') return gkPool;
    return [];
  })();

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4">

      {/* LEFT: Squad, Pitch & Stats Dashboard */}
      <div className="lg:w-1/3 space-y-6">
        <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Squad Builder</h2>

        {/* Budget HUD */}
        <div className="bg-[#060608] border border-[#1E3A8A]/30 rounded p-6 shadow-[0_0_15px_rgba(30,58,138,0.1)]">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Budget</div>
              <div className={`text-2xl font-display ${remainingBudget < 0 ? 'text-red-500' : 'text-white'}`}>
                ${remainingBudget}M
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-[#1E3A8A] font-bold uppercase tracking-widest mb-1">Total OVR</div>
              <div className="text-2xl font-display text-white">{totalOVR}</div>
            </div>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1E3A8A] h-full transition-all" style={{ width: `${Math.min(100, (currentCost / MAX_BUDGET) * 100)}%` }}></div>
          </div>
          <div className="mt-4 text-[9px] text-gray-500 uppercase tracking-widest flex justify-between">
            <span>{totalSlots}/13 Squad</span>
            <span>Max ${MAX_BUDGET}M</span>
          </div>
          <div className="mt-1 text-[9px] text-gray-500 uppercase tracking-widest flex justify-between">
            <span>{fieldSquad.length}/11 XI</span>
            <span className={superSub ? 'text-[#1E3A8A]' : ''}>{superSub ? '1/1 Super Sub' : '0/1 Super Sub'}</span>
            <span className={manager ? 'text-[#1E3A8A]' : ''}>{manager ? '1/1 Manager' : '0/1 Manager'}</span>
          </div>
        </div>

        {/* Formation picker */}
        <div className="bg-[#060608] border border-gray-900 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Formation</div>
            <div className={`text-[9px] uppercase tracking-widest font-bold ${formationMatches ? 'text-emerald-500' : 'text-amber-500'}`}>
              {formationMatches ? 'Matches XI' : 'XI mismatch'}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {Object.keys(FORMATIONS).map(key => (
              <button
                key={key}
                onClick={() => changeFormation(key)}
                className={`px-2.5 py-1 text-[9px] font-bold rounded border ${
                  formationKey === key ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Pitch */}
          <div className="relative w-full aspect-[3/4] rounded overflow-hidden border border-gray-800"
               style={{ background: 'repeating-linear-gradient(180deg, #0d2410, #0d2410 10%, #0f2a13 10%, #0f2a13 20%)' }}>
            <div className="absolute inset-3 border border-white/10 rounded-sm"></div>
            {slots.map(slot => {
              const occupantId = slotAssignments[slot.id];
              const occupant = fieldSquad.find(p => p.id === occupantId);
              const isPickable = selectedPlayerId && fieldSquad.find(p => p.id === selectedPlayerId) && posGroup(fieldSquad.find(p => p.id === selectedPlayerId)) === slot.group;
              return (
                <button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                  className={`absolute flex flex-col items-center justify-center w-14 h-14 rounded-full border text-[8px] font-bold text-center leading-tight px-0.5
                    ${occupant ? 'bg-[#1E3A8A] border-white/40 text-white' : 'bg-black/50 border-dashed border-white/30 text-white/40'}
                    ${occupantId && occupantId === selectedPlayerId ? 'ring-2 ring-amber-400' : ''}
                    ${isPickable && !occupant ? 'ring-2 ring-emerald-400 animate-pulse' : ''}`}
                >
                  {occupant ? occupant.name.split(' ').slice(-1)[0] : slot.group}
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-[8px] text-gray-600 uppercase tracking-widest leading-relaxed">
            Tap a bench player, then tap a pitch slot to place them. Tap a filled slot to pick that player back up.
          </div>
        </div>

        {/* Bench / selected players list */}
        <div className="bg-[#060608] border border-gray-900 rounded p-4 max-h-[320px] overflow-y-auto">
          {fieldSquad.length === 0 && !superSub && !manager ? (
            <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest py-8">Squad is empty</div>
          ) : (
            <div className="space-y-2">
              {fieldSquad.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleBenchClick(p.id)}
                  className={`flex justify-between items-center p-3 bg-black border rounded text-xs cursor-pointer ${
                    selectedPlayerId === p.id ? 'border-amber-400' : 'border-gray-800'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{p.name}</span>
                    <span className="text-[9px] text-gray-500">{p.nation} · {groupLabel[posGroup(p)]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-[10px] bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded">{p.pos}</span>
                    <span className="text-[#1E3A8A] font-bold">${p.cost}M</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleFieldPlayer(p); }} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                </div>
              ))}
              {superSub && (
                <div className="flex justify-between items-center p-3 bg-black border border-amber-500/40 rounded text-xs">
                  <div className="flex flex-col">
                    <span className="text-amber-400 font-bold">{superSub.name}</span>
                    <span className="text-[9px] text-gray-500">Super Sub (2.0x)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E3A8A] font-bold">${superSub.cost}M</span>
                    <button onClick={() => toggleSuperSub(superSub)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                </div>
              )}
              {manager && (
                <div className="flex justify-between items-center p-3 bg-black border border-purple-500/40 rounded text-xs">
                  <div className="flex flex-col">
                    <span className="text-purple-400 font-bold">{manager.name}</span>
                    <span className="text-[9px] text-gray-500">{manager.buffDesc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#1E3A8A] font-bold">${manager.cost}M</span>
                    <button onClick={() => toggleManager(manager)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetSquad}
            className="flex-1 py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] border border-gray-800 text-gray-500 hover:text-gray-300"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`flex-[2] py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              canSubmit && !submitting ? 'bg-[#1E3A8A] text-white hover:bg-blue-800' : 'bg-gray-900 text-gray-600 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting…' : submitted ? 'Submitted ✓' : 'Submit Final XI'}
          </button>
        </div>
        {submitError && (
          <div className="text-[10px] text-red-500 uppercase tracking-widest text-center">{submitError}</div>
        )}
        {submitted && !submitError && (
          <div className="text-[10px] text-emerald-500 uppercase tracking-widest text-center">
            Squad saved — you can keep editing and resubmit any time before the round closes.
          </div>
        )}
      </div>

      {/* RIGHT: The Transfer Market Pool with Tabs */}
      <div className="lg:w-2/3 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Market Data</h2>
          <div className="flex flex-wrap gap-1 bg-[#060608] p-1 rounded border border-gray-900 w-fit">
            {['ALL', 'FWD', 'MID', 'DEF', 'GK', 'SS', 'MAN'].map(tab => (
              <button
                key={tab}
                onClick={() => setMarketTab(tab)}
                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-colors ${
                  marketTab === tab ? 'bg-[#1E3A8A] text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                }`}
              >
                {tab === 'FWD' ? 'Attackers' : tab === 'MID' ? 'Midfielders' : tab === 'DEF' ? 'Defenders' : tab === 'GK' ? 'Goalkeepers' : tab === 'SS' ? 'Super Subs' : tab === 'MAN' ? 'Managers' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {marketTab === 'MAN' ? (
          <div className="bg-[#060608] border border-gray-900 rounded p-4 grid sm:grid-cols-2 gap-3">
            {managerPool.map(m => {
              const isSelected = manager && manager.id === m.id;
              const disabled = !isSelected && !!manager;
              return (
                <div key={m.id} className={`p-4 rounded border ${isSelected ? 'border-purple-500 bg-purple-500/5' : 'border-gray-800'}`}>
                  <div className="text-white font-bold text-sm">{m.name}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{m.buffDesc}</div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#1E3A8A] font-bold text-xs">${m.cost}M</span>
                    <button
                      disabled={disabled}
                      onClick={() => toggleManager(m)}
                      className={`px-3 py-1.5 rounded border text-[9px] font-bold tracking-widest ${
                        isSelected ? 'border-red-500 text-red-500' : disabled ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                      }`}
                    >
                      {isSelected ? 'Remove' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="sm:col-span-2 text-[9px] text-gray-600 uppercase tracking-widest">Only one manager can be active — picking a new one replaces the current pick.</div>
          </div>
        ) : marketTab === 'SS' ? (
  <div className="space-y-4">
    {/* LEGENDARY GOALKEEPER */}
    <div className="bg-[#060608] border border-amber-500/20 rounded overflow-hidden">
      <div className="px-4 pt-3 text-[9px] text-amber-500 uppercase tracking-widest">Legendary Goalkeeper</div>
      
      {/* MOBILE: Cards */}
      <div className="md:hidden p-4">
        {legendGK.map(p => (
          <PlayerCard key={p.id} p={p} gk isSelected={superSub?.id === p.id} disabled={!!superSub} onToggle={handleToggle} />
        ))}
      </div>
      
      {/* DESKTOP: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-[10px] uppercase tracking-wider text-gray-400 min-w-[900px]">
          <thead className="bg-black border-b border-gray-900"><GKHeader /></thead>
          <tbody className="divide-y divide-gray-900/50">
            {legendGK.map(p => (
              <PlayerRow key={p.id} p={p} gk isSelected={superSub?.id === p.id} disabled={!!superSub} onToggle={handleToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* LEGENDARY OUTFIELDERS */}
    <div className="bg-[#060608] border border-amber-500/20 rounded overflow-hidden">
      <div className="px-4 pt-3 text-[9px] text-amber-500 uppercase tracking-widest">Legendary Outfielders</div>
      
      {/* MOBILE: Cards */}
      <div className="md:hidden p-4">
        {legendOutfield.map(p => (
          <PlayerCard key={p.id} p={p} isSelected={superSub?.id === p.id} disabled={!!superSub} onToggle={handleToggle} />
        ))}
      </div>

      {/* DESKTOP: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-[10px] uppercase tracking-wider text-gray-400 min-w-[900px]">
          <thead className="bg-black border-b border-gray-900"><OutfieldHeader /></thead>
          <tbody className="divide-y divide-gray-900/50">
            {legendOutfield.map(p => (
              <PlayerRow key={p.id} p={p} isSelected={superSub?.id === p.id} disabled={!!superSub} onToggle={handleToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
        ) : (
          <>
            {/* MOBILE VIEW: Cards */}
            <div className="md:hidden space-y-2 max-h-[600px] overflow-y-auto pb-6">
              {marketList.map(p => {
                const isSelected = !!fieldSquad.find(s => s.id === p.id);
                const disabled = fieldSquad.length >= FIELD_MAX || remainingBudget < p.cost;
                return (
                  <PlayerCard 
                    key={p.id} 
                    p={p} 
                    gk={marketTab === 'GK'} 
                    isSelected={isSelected} 
                    disabled={disabled} 
                    onToggle={handleToggle} 
                  />
                );
              })}
            </div>

            {/* DESKTOP VIEW: Table */}
<div className="hidden md:block overflow-x-auto border border-gray-900 rounded">
  <table className="w-full text-left text-[10px] uppercase tracking-wider text-gray-400 min-w-[900px]">
    <thead className="bg-black border-b border-gray-900 sticky top-0 z-10">
      {marketTab === 'GK' ? <GKHeader /> : <OutfieldHeader />}
    </thead>
    <tbody className="divide-y divide-gray-900/50">
      {marketList.map(p => {
        const isSelected = !!fieldSquad.find(s => s.id === p.id);
        const disabled = fieldSquad.length >= FIELD_MAX || remainingBudget < p.cost;
        return (
          <PlayerRow 
            key={p.id} 
            p={p} 
            gk={marketTab === 'GK'} 
            isSelected={isSelected} 
            disabled={disabled} 
            onToggle={handleToggle} 
          />
        );
      })}
    </tbody>
  </table>
</div>
            </>
        )}
  </div>

      </div> 
  );
}