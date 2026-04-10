import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Menu } from './menu.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  district: string; // 구 (gu)

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @OneToMany(() => Menu, (menu) => menu.restaurant, { eager: true, cascade: true })
  menus: Menu[]; // 메뉴 목록 (isRepresentative=true인 것이 대표 메뉴)

  @ManyToMany(() => Category, (category) => category.restaurants, { eager: true, cascade: true })
  @JoinTable({ name: 'restaurant_categories' })
  categories: Category[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: true })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
