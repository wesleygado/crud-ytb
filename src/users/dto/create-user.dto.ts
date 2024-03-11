import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome não pode ser vazio.' })
  @Length(3, 50, { message: 'Mínimo 3 caracteres e máximo de 50.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  nome: string;

  @IsNotEmpty()
  @Length(5, 25)
  email: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
