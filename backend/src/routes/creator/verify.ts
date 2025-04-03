import { Router } from 'express'
import { prisma } from '../../lib/prisma'
import { authenticateCreator } from '../../middleware/auth'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Complete a verification step
router.post('/', authenticateCreator, async (req, res) => {
  try {
    const { step } = req.body
    const userId = req.user.id

    // Update the creator profile with the completed step
    await prisma.creatorProfile.update({
      where: { userId },
      data: {
        [`${step}Verified`]: true,
        [`${step}VerifiedAt`]: new Date()
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error completing verification step:', error)
    res.status(500).json({ error: 'Failed to complete verification step' })
  }
})

// Upload ID document
router.post('/identity', authenticateCreator, upload.single('idDocument'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const userId = req.user.id
    const fileBuffer = req.file.buffer
    const fileType = req.file.mimetype

    // Here you would typically:
    // 1. Upload the file to a secure storage (e.g., S3)
    // 2. Send it to an identity verification service
    // 3. Store the verification status in the database

    // For now, we'll just mark it as uploaded
    await prisma.creatorProfile.update({
      where: { userId },
      data: {
        idDocumentUploaded: true,
        idDocumentUploadedAt: new Date()
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error uploading ID document:', error)
    res.status(500).json({ error: 'Failed to upload ID document' })
  }
})

// Complete the entire verification process
router.post('/complete', authenticateCreator, async (req, res) => {
  try {
    const userId = req.user.id

    // Check if all steps are completed
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId }
    })

    if (!profile) {
      return res.status(404).json({ error: 'Creator profile not found' })
    }

    if (!profile.identityVerified || !profile.termsVerified || !profile.feesVerified) {
      return res.status(400).json({ 
        error: 'All verification steps must be completed',
        missingSteps: {
          identity: !profile.identityVerified,
          terms: !profile.termsVerified,
          fees: !profile.feesVerified
        }
      })
    }

    // Mark the creator as fully verified
    await prisma.creatorProfile.update({
      where: { userId },
      data: {
        isVerified: true,
        verifiedAt: new Date()
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error completing verification:', error)
    res.status(500).json({ error: 'Failed to complete verification' })
  }
})

export default router 