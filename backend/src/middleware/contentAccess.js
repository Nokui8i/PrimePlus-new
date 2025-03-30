const { Subscription, Content } = require('../models');

// מידלוור לבדיקת גישה לתוכן פרימיום
exports.checkContentAccess = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;

    // מצא את התוכן המבוקש
    const content = await Content.findByPk(contentId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // אם התוכן אינו פרימיום, אפשר גישה לכולם
    if (!content.isPremium) {
      return next();
    }

    // אם המשתמש הוא היוצר של התוכן, אפשר גישה
    if (content.userId === userId) {
      return next();
    }

    // אם המשתמש הוא מנהל, אפשר גישה
    if (req.user.role === 'admin') {
      return next();
    }

    // בדוק אם למשתמש יש מנוי פעיל ליוצר של התוכן
    const subscription = await Subscription.findOne({
      where: {
        subscriberId: userId,
        creatorId: content.userId,
        status: 'active'
      }
    });

    if (subscription) {
      // יש למשתמש מנוי פעיל, אפשר גישה
      return next();
    }

    // בדוק אם המשתמש רכש את התוכן הספציפי הזה
    // כאן אתה יכול להוסיף לוגיקה לבדיקה אם המשתמש רכש את התוכן בנפרד

    // אם הגענו לכאן, למשתמש אין גישה
    return res.status(403).json({
      success: false,
      message: 'Access denied: Premium content requires an active subscription',
      isPremium: true,
      contentId: contentId,
      creatorId: content.userId
    });
    
  } catch (error) {
    console.error('Error checking content access:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking content access',
      error: error.message
    });
  }
};

// מידלוור לבדיקת גישה לתוכן VR פרימיום
exports.checkVRContentAccess = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;

    // מצא את תוכן ה-VR המבוקש
    const vrContent = await require('../models/VRContent').findByPk(contentId);
    
    if (!vrContent) {
      return res.status(404).json({
        success: false,
        message: 'VR Content not found'
      });
    }

    // אם התוכן אינו פרימיום, אפשר גישה לכולם
    if (!vrContent.isPremium) {
      return next();
    }

    // אם המשתמש הוא היוצר של התוכן, אפשר גישה
    if (vrContent.userId === userId) {
      return next();
    }

    // אם המשתמש הוא מנהל, אפשר גישה
    if (req.user.role === 'admin') {
      return next();
    }

    // בדוק אם למשתמש יש מנוי פעיל ליוצר של התוכן
    const subscription = await Subscription.findOne({
      where: {
        subscriberId: userId,
        creatorId: vrContent.userId,
        status: 'active'
      }
    });

    if (subscription) {
      // יש למשתמש מנוי פעיל, אפשר גישה
      return next();
    }

    // אם הגענו לכאן, למשתמש אין גישה
    return res.status(403).json({
      success: false,
      message: 'Access denied: Premium VR content requires an active subscription',
      isPremium: true,
      contentId: contentId,
      creatorId: vrContent.userId
    });
    
  } catch (error) {
    console.error('Error checking VR content access:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking VR content access',
      error: error.message
    });
  }
};