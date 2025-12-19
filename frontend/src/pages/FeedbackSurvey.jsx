import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Smile, Frown, Meh, Heart, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import AnimatedButton from '../components/AnimatedButton'
import toast from 'react-hot-toast'

const FeedbackSurvey = () => {
  const [rating, setRating] = useState(0)
  const [emoji, setEmoji] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [surveyAnswers, setSurveyAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAnswerChange = (questionId, value) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const emojis = [
    { icon: Smile, label: 'Happy', value: 'happy' },
    { icon: Meh, label: 'Neutral', value: 'neutral' },
    { icon: Frown, label: 'Sad', value: 'sad' },
  ]

  const surveyQuestions = [
    { id: 1, question: 'How satisfied are you with the platform?', type: 'rating' },
    { id: 2, question: 'How likely are you to recommend AlumniFusion to others?', type: 'rating' },
    { id: 3, question: 'How easy is it to navigate the platform?', type: 'rating' },
    { id: 4, question: 'What features would you like to see added?', type: 'text' },
    { id: 5, question: 'Any additional comments or suggestions?', type: 'text' },
  ]

  const handleSubmit = async () => {
    if (rating === 0 && !feedback && Object.keys(surveyAnswers).length === 0) {
      toast.error('Please provide some feedback before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id || user?._id

      const formattedSurveyAnswers = surveyQuestions.map(q => ({
        question: q.question,
        answer: surveyAnswers[q.id] || (q.type === 'rating' ? '0' : '')
      }))

      const payload = {
        userId,
        emoji,
        feedback,
        surveyAnswers: formattedSurveyAnswers
      }

      if (rating > 0) {
        payload.rating = rating
      }

      await api.post('/feedback', payload)

      toast.success('Thank you for your feedback!')
      setSubmitted(true)
      setTimeout(() => {
        setRating(0)
        setEmoji(null)
        setFeedback('')
        setSurveyAnswers({})
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('Failed to submit feedback. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeader
        title="Feedback & Survey"
        subtitle="Help us improve AlumniFusion with your valuable feedback"
      />

      <div className="max-w-3xl mx-auto">
        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              How would you rate your experience?
            </h3>
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={48}
                    className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-gray-600 dark:text-gray-400">
                You rated {rating} out of 5 stars
              </p>
            )}
          </GlassCard>
        </motion.div>

        {/* Emoji Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              How do you feel about AlumniFusion?
            </h3>
            <div className="flex justify-center space-x-6">
              {emojis.map((emojiOption) => {
                const Icon = emojiOption.icon
                return (
                  <button
                    key={emojiOption.value}
                    onClick={() => setEmoji(emojiOption.value)}
                    className={`p-4 rounded-full transition-all ${emoji === emojiOption.value
                      ? 'bg-primary-100 dark:bg-primary-900 scale-110'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Icon size={48} className={emoji === emojiOption.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'} />
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{emojiOption.label}</p>
                  </button>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Survey Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Survey Questions</h3>
            <div className="space-y-6">
              {surveyQuestions.map((question, index) => (
                <div key={question.id}>
                  <label className="block text-lg font-medium mb-3 text-gray-900 dark:text-white">
                    {question.question}
                  </label>
                  {question.type === 'rating' ? (
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleAnswerChange(question.id, star.toString())}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={(surveyAnswers[question.id] || 0) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'}
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      rows="3"
                      value={surveyAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      placeholder="Your answer..."
                    />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Additional Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Additional Feedback
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="6"
              className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
              placeholder="Share your thoughts, suggestions, or concerns..."
            />
          </GlassCard>
        </motion.div>

        {/* Submit Button */}
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <GlassCard>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Thank You!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your feedback has been submitted successfully.
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <AnimatedButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Meh size={24} />
                  </motion.div>
                  Submitting...
                </div>
              ) : (
                <>
                  <Heart className="inline mr-2" size={24} />
                  Submit Feedback
                </>
              )}
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FeedbackSurvey

