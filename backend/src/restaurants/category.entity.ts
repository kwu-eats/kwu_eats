import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // 한식, 중식, 양식, 분식, 일식, 기타

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.categories)
  restaurants: Restaurant[];
}
