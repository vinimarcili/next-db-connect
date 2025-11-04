import { Gender } from '@/interfaces/gender.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'subscribers' })
export class Subscribers {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number = 0;

  @Column({ type: 'varchar', length: 100, name: 'name' })
  name: string = '';

  @Column({ type: 'varchar', length: 255, name: 'email', unique: true })
  email: string = '';

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'gender' })
  gender: Gender | null = null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date = new Date();

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date = new Date();

  constructor(init?: Partial<Subscribers>) {
    Object.assign(this, init);
  }
}
