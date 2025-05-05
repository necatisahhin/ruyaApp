export interface Ruya {
  id: string;
  baslik: string;
  icerik: string;
  tarih?: Date;
  isFavorite?: boolean; 
  kategori: string;
  yorum?: string; 
}
