import { DeleteResult, UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";

export const userMock: User = {
  id: 50,
  nome: "Paulo",
  cidade: "Guarulhos",
  estado: "São Paulo",
  logradouro: "Rua Utama",
  cep: "07020321",
  email: "wesley@gmail.com",
  password: "123123"
}

export const updateResultMock: UpdateResult = {
  affected: 1,
  raw: 0,
  generatedMaps: []
 }
 
 export const deleteResultMock: DeleteResult = {
   affected: 1,
   raw: 0,
 }
 
 export const updateResultMockException: UpdateResult = {
   affected: 0,
   raw: 0,
   generatedMaps: []
  }
  
  export const deleteResultMockException: DeleteResult = {
    affected: 0,
    raw: 0,
  }