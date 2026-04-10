import axios from 'axios';
import { Restaurant } from '@/types/restaurant';

const api = axios.create({ baseURL: '/api' });

export const getRestaurants = (maxPrice?: number): Promise<Restaurant[]> =>
  api.get('/restaurants', { params: maxPrice ? { maxPrice } : {} }).then(r => r.data);

export const getRecent = (): Promise<Restaurant[]> =>
  api.get('/restaurants/recent').then(r => r.data);

export const getRanking = (): Promise<Restaurant[]> =>
  api.get('/restaurants/ranking').then(r => r.data);

export const getRestaurant = (id: number): Promise<Restaurant> =>
  api.get(`/restaurants/${id}`).then(r => r.data);

export const likeRestaurant = (id: number): Promise<Restaurant> =>
  api.post(`/restaurants/${id}/like`).then(r => r.data);

export const createRestaurant = (data: Partial<Restaurant>): Promise<Restaurant> =>
  api.post('/restaurants', data).then(r => r.data);

export const seedRestaurants = (): Promise<void> =>
  api.get('/restaurants/seed').then(r => r.data);
