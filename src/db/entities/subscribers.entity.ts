import { Gender } from '@/interfaces/gender';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'subscribers' })
export class SubscribeData {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'varchar', length: 100 })
  name: string = '';

  @Column({ type: 'varchar', length: 255 })
  email: string = '';

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: Gender | null = null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date = new Date();

  constructor(init?: Partial<SubscribeData>) {
    Object.assign(this, init);
  }
}
