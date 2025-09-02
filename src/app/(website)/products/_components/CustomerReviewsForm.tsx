/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Star } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { ApiResponse } from '../../../../../types/product'

interface ProductData {
  _id: string
  name: string
  description: string
  price: number
  discountPrice: number
  image: string
  reviews: any[]
  category: {
    _id: string
    name: string
  }
  subCategory: {
    _id: string
    name: string
  }
}

interface ReviewFormData {
  rating: number
  review: string
  name: string
  email: string
  saveInfo: boolean
}

interface CustomerReviewsFormProps {
  productData: ProductData
}

const CustomerReviewsForm: React.FC<CustomerReviewsFormProps> = ({ productData }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    review: '',
    name: '',
    email: '',
    saveInfo: false
  })
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  const createReviewMutation = useMutation<
    ApiResponse,
    Error,
    {
      user: string
      food: string
      rating: number
      comment: string
    }
  >({
    mutationFn: async (newReview) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/review/createreview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create review')
      }

      return res.json()
    },
    onSuccess: () => {
      alert('Review submitted successfully!')
      setFormData({ rating: 0, review: '', name: '', email: '', saveInfo: false })
    },
    onError: (error) => {
      console.error('Error creating review:', error.message)
      alert(`Failed to submit review: ${error.message}`)
    }
  })

  const handleRatingClick = (rating: number) => setFormData(prev => ({ ...prev, rating }))
  const handleRatingHover = (rating: number) => setHoveredRating(rating)
  const handleInputChange = (field: keyof ReviewFormData, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, rating, review } = formData

    if (!name.trim() || !email.trim() || !rating || !review.trim()) {
      alert('Please fill in all required fields: Name, Email, Rating, and Comment.')
      return
    }

    const reviewData = {
      user: '68a4a5903611f2d9a1e0a3ed', // Replace with actual user id
      food: productData._id,
      rating,
      comment: review.trim()
    }

    createReviewMutation.mutate(reviewData)
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (hoveredRating || formData.rating)
      stars.push(
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`w-5 h-5 transition-colors duration-200 ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      )
    }
    return stars
  }


  return (
    <div className="container mx-auto px-4 bg-white lg:mb-[58px] md:mb-[43px] mb-[38px]">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="lg:text-[32px] md:text-[28px] text-[20px] font-semibold leading-[120%] mb-8">
            Customer Reviews
          </h1>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Your Rating *</label>
            <div className="flex items-center gap-1">{renderStars()}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Review *</label>
            <Textarea
              placeholder={`Share your thoughts about ${productData.name}...`}
              value={formData.review}
              onChange={(e) => handleInputChange('review', e.target.value)}
              className="min-h-[120px] resize-none border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 h-[51px]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 h-[51px]"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-info"
              checked={formData.saveInfo}
              onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
              className="border-gray-300 w-[22px] h-[22px]"
            />
            <label htmlFor="save-info" className="text-base text-gray-700 cursor-pointer">
              Save my name, email, and website in this browser for the next time I comment.
            </label>
          </div>

          <div>
            <Button
              type="submit"
              className="bg-red-600 h-[51px] hover:bg-red-700 text-white text-lg px-10 rounded-md font-medium transition-colors duration-200"
              disabled={
                !formData.rating || !formData.review.trim() || !formData.name.trim() || !formData.email.trim() || createReviewMutation.isPending
              }
            >
              {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerReviewsForm
