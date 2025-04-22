const Dream = require('../models/Dream');
const User = require('../models/User');

// Rüya kaydetme
exports.saveDream = async (req, res) => {
  try {
    const { title, content, category, interpretation } = req.body;
    const userId = req.user.id;

    // Rüyayı kaydet
    const dream = await Dream.create({
      userId,
      title,
      content,
      category,
      interpretation,
      isFavorite: false
    });

    res.status(201).json({
      success: true,
      data: dream
    });
  } catch (error) {
    console.error('Rüya kaydetme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

// Kullanıcının rüyalarını getir
exports.getUserDreams = async (req, res) => {
  try {
    const userId = req.user.id;

    const dreams = await Dream.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: dreams.length,
      data: dreams
    });
  } catch (error) {
    console.error('Rüyaları getirme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

// Tek bir rüyayı getir
exports.getDream = async (req, res) => {
  try {
    const dreamId = req.params.id;
    const userId = req.user.id;

    const dream = await Dream.findOne({
      where: { 
        id: dreamId,
        userId 
      }
    });

    if (!dream) {
      return res.status(404).json({ 
        success: false,
        message: 'Rüya bulunamadı' 
      });
    }

    res.status(200).json({
      success: true,
      data: dream
    });
  } catch (error) {
    console.error('Rüya getirme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

// Rüyayı güncelle
exports.updateDream = async (req, res) => {
  try {
    const dreamId = req.params.id;
    const userId = req.user.id;
    const { title, content, category, interpretation, isFavorite } = req.body;

    // Rüyanın var olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
    let dream = await Dream.findOne({
      where: { 
        id: dreamId,
        userId 
      }
    });

    if (!dream) {
      return res.status(404).json({ 
        success: false,
        message: 'Rüya bulunamadı' 
      });
    }

    // Rüyayı güncelle
    dream = await dream.update({
      title: title || dream.title,
      content: content || dream.content,
      category: category || dream.category,
      interpretation: interpretation || dream.interpretation,
      isFavorite: isFavorite !== undefined ? isFavorite : dream.isFavorite
    });

    res.status(200).json({
      success: true,
      data: dream
    });
  } catch (error) {
    console.error('Rüya güncelleme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

// Rüyayı sil
exports.deleteDream = async (req, res) => {
  try {
    const dreamId = req.params.id;
    const userId = req.user.id;

    // Rüyanın var olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
    const dream = await Dream.findOne({
      where: { 
        id: dreamId,
        userId 
      }
    });

    if (!dream) {
      return res.status(404).json({ 
        success: false,
        message: 'Rüya bulunamadı' 
      });
    }

    // Rüyayı sil
    await dream.destroy();

    res.status(200).json({
      success: true,
      message: 'Rüya başarıyla silindi'
    });
  } catch (error) {
    console.error('Rüya silme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
}; 