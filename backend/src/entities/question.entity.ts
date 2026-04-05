import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Interview } from './interview.entity';
import { Answer } from './answer.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Interview, (interview) => interview.questions, { onDelete: 'CASCADE' })
  interview!: Interview;

  @Column({ type: 'text' })
  question_text!: string;

  @Column({ type: 'int' })
  order_index!: number;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];
}
