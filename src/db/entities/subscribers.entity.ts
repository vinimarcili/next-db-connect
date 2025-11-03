import { Gender } from '@/interfaces/gender';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'SUBSCRIBERS' })
export class Subscribers {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number = 0;

  @Column({ type: 'varchar', length: 100, name: 'NAME' })
  name: string = '';

  @Column({ type: 'varchar', length: 255, name: 'EMAIL' })
  email: string = '';

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'GENDER' })
  gender: Gender | null = null;

  @CreateDateColumn({ type: 'date', name: 'CREATED_AT' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'date', name: 'UPDATED_AT' })
  updatedAt: Date = new Date();

  constructor(init?: Partial<Subscribers>) {
    Object.assign(this, init);
  }
}
