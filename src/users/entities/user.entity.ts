import { Exclude, Expose } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 150 })
  nome: string;

  @Column({ nullable: false, length: 150, unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;
}
