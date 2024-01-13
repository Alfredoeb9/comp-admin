import ky from 'ky'
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async (limit = 10) => {
  const parsed = await ky('/api/game-category').json()
  return parsed
}

const usePosts = (limit: number | undefined) => {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: () => fetchPosts(limit),
  })
}

export { usePosts, fetchPosts }