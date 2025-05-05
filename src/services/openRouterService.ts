import axios from "react-native-axios"; // axios yerine react-native-axios kullanıyoruz

const OPENROUTER_API_KEY =
  "your-openrouter-api-key";

// OpenRouter API'ye istek atmak için temel yapılandırma
const openRouterApi = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "HTTP-Referer": "el-emegi-ruya-yorumlama-app",
    "X-Title": "El Emeği Rüya Yorumlama",
    "Content-Type": "application/json",
  },
});

/**
 * Yapay zeka yanıtlarını formatlamak için yardımcı fonksiyon
 * Gereksiz sembolleri ve fazla boşlukları kaldırır
 * @param text Formatlanacak metin
 * @returns Formatlanmış metin
 */
const formatAIResponse = (text: string): string => {
  if (!text) return "";

  // ** ve -- gibi sembolleri temizle
  let formattedText = text
    .replace(/\*{2,}/g, "") // ** sembollerini kaldır
    .replace(/--+/g, "") // -- sembollerini kaldır
    .replace(/_{2,}/g, "") // __ sembollerini kaldır
    .replace(/#{2,}/g, "") // ## sembollerini kaldır
    .replace(/={2,}/g, ""); // == sembollerini kaldır

  // Başlık formatlarını düzenle (Örn: "# Başlık" -> "Başlık:")
  formattedText = formattedText.replace(/^#\s+(.+)$/gm, "$1:");

  // Ardışık boş satırları tek boş satıra indirgeme
  formattedText = formattedText.replace(/\n{3,}/g, "\n\n");

  // Başlangıç ve sonundaki fazla boşlukları temizle
  formattedText = formattedText.trim();

  return formattedText;
};

/**
 * İslamik usullere göre rüya yorumlama API çağrısı
 * @param title Rüya başlığı
 * @param description Rüya detaylı açıklaması
 * @param category Rüya kategorisi (opsiyonel)
 * @param userProfile Kullanıcı profil bilgileri (opsiyonel)
 * @returns API yanıtı - Yorumlanmış rüya bilgisi
 */
export const interpretDream = async (
  title: string,
  description: string,
  category?: string,
  userProfile?: {
    age?: number;
    gender?: string;
    maritalStatus?: string;
  }
): Promise<string> => {
  try {
    // İslamik usullere uygun rüya yorumlama promptu
    const prompt = `Sen çok iyi bir İslami rüya yorumcususun. 
    Lütfen aşağıdaki rüyayı İslami kaynaklara ve usullere göre detaylı olarak yorumla. 
    
    Rüya Anlatımı: ${description}
    
    ${userProfile?.age ? `Rüya Sahibinin Yaşı: ${userProfile.age}` : ""}
    ${userProfile?.gender ? `Rüya Sahibinin Cinsiyeti: ${userProfile.gender}` : ""}
    ${userProfile?.maritalStatus ? `Rüya Sahibinin Medeni Hali: ${userProfile.maritalStatus}` : ""}
    
    Önce rüyadaki sembolleri İslami kaynaklarda ne anlama geldiğini açıkla,
    sonra genel yorumunu belirt. Yorumunda rüya sahibinin yaşını, cinsiyetini ve medeni halini göz önünde bulundur.
    Son olarak rüya sahibine tavsiyeler ver.
    Cevabını düzenli paragraflar halinde ve anlaşılır bir Türkçe ile yap.
    
    NOT: Rüya yorumunda başlık ve kategori bilgisini dikkate alma, bunun yerine rüya içeriğini ve kişinin demografik bilgilerini (yaş, cinsiyet, medeni hal) baz al.`;

    const response = await openRouterApi.post("/chat/completions", {
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message
    ) {
      // API yanıtını formatla ve döndür
      return formatAIResponse(response.data.choices[0].message.content);
    } else {
      throw new Error("API yanıtı beklenen formatta değil");
    }
  } catch (error) {
    console.error("Rüya yorumlama hatası:", error);
    throw new Error(
      "Rüya yorumlanırken bir hata oluştu. Lütfen tekrar deneyin."
    );
  }
};
