import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column()
  restaurantId: number;

  @Column()
  name: string; // 메뉴명

  @Column('int')
  price: number; // 가격 (원)

  @Column({ default: false })
  isRepresentative: boolean; // 대표 메뉴 여부

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
