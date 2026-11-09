import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Star, Check, Trash2 } from 'lucide-react';
interface Review {
  id: string;
  customer: string;
  product: string;
  rating: number;
  text: string;
  approved: boolean;
}
const INITIAL_REVIEWS: Review[] = [
{
  id: 'r1',
  customer: 'Eleanor Rigby',
  product: 'Royal Canin Premium Adult Dog Food',
  rating: 5,
  text: 'My retriever loves it. Coat has never looked better!',
  approved: true
},
{
  id: 'r2',
  customer: 'James Thornton',
  product: 'Rimless Crystal Aquarium 50G',
  rating: 5,
  text: 'A stunning centerpiece. Crystal clear glass.',
  approved: false
},
{
  id: 'r3',
  customer: 'Sophia Laurent',
  product: 'Velvet Cat Tree Tower',
  rating: 4,
  text: 'Beautiful and sturdy, though assembly took a while.',
  approved: false
},
{
  id: 'r4',
  customer: 'Marcus Chen',
  product: 'Premium Koi Fish Food',
  rating: 5,
  text: 'Colors on my koi are so much more vibrant now.',
  approved: true
}];

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-text mb-2">
          Reviews
        </h1>
        <p className="text-text-light">Moderate customer product reviews.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) =>
        <div
          key={r.id}
          className="bg-white rounded-2xl shadow-soft border border-accent p-6 flex flex-col md:flex-row md:items-center gap-4">
          
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-serif font-semibold">
                  {r.customer.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-text">{r.customer}</div>
                  <div className="text-xs text-text-light">on {r.product}</div>
                </div>
                <div className="flex gap-0.5 ml-2">
                  {[...Array(5)].map((_, i) =>
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />

                )}
                </div>
              </div>
              <p className="text-text-light text-sm italic">"{r.text}"</p>
            </div>
            <div className="flex items-center gap-3">
              <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${r.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              
                {r.approved ? 'Approved' : 'Pending'}
              </span>
              {!r.approved &&
            <button
              onClick={() =>
              setReviews(
                reviews.map((x) =>
                x.id === r.id ?
                {
                  ...x,
                  approved: true
                } :
                x
                )
              )
              }
              className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
              aria-label="Approve review">
              
                  <Check className="w-4 h-4" />
                </button>
            }
              <button
              onClick={() => setReviews(reviews.filter((x) => x.id !== r.id))}
              className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
              aria-label="Delete review">
              
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>);

}