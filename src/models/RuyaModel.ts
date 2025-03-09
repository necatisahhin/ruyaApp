export interface Ruya {
  id: string;
  baslik: string;
  icerik: string;
  tarih?: Date;
  isFavorite?: boolean; // Favori durumunu takip etmek için yeni alan
  kategori: string;
  yorum?: string; // Rüya yorumunu saklamak için yeni eklenen alan
}
