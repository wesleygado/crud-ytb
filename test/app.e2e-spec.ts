import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { CepServiceMock } from '../src/core/consulta-cep/consulta-cep.mock';
import { ICepService } from '../src/core/consulta-cep/consulta-cep';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configTest } from '../src/orm-config';
import { NotFoundError } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const users: User[] = [
    {
      id: expect.any(Number),
      nome: "wesley",
      cidade: "Guarulhos",
      estado: "SP",
      logradouro: "Rua Utama",
      cep: "07020-321",
      email: "wesley@gmail.com",
      password: "123123"
    },
    {
      id: expect.any(Number),
      nome: "bruna",
      cidade: "Guarulhos",
      estado: "SP",
      logradouro: "Rua Utama",
      cep: "07020-321",
      email: "bruna@gmail.com",
      password: "123123"
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(configTest),
      ],
    }).overrideProvider(ICepService)
      .useClass(CepServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const dataSource = app.get(DataSource);
    dataSource.dropDatabase();
  });

  it('deve retornar lista de usuários /users (GET)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: users[0].nome,
        cep: users[0].cep,
        email: users[0].email,
        password: users[0].password,
      });

    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: users[1].nome,
        cep: users[1].cep,
        email: users[1].email,
        password: users[1].password,
      });

    const response = await request(app.getHttpServer())
      .get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });

  it('deve criar um novo usuário /users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'teste',
        email: 'teste@teste.com',
        password: '123123',
        cep: '07020321'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      nome: 'teste',
      cep: "07020-321",
      email: "teste@teste.com",
      password: "123123",
      cidade: "Guarulhos",
      estado: "SP",
      logradouro: "Rua Utama",
      id: expect.any(Number)
    });
  });

  it('deve retornar cep not found ao cadastrar usuário com cep incorreto /users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'teste',
        email: 'teste@teste.com',
        password: '123123',
        cep: '00000000'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      "error": "Not Found",
      "message": "CEP não localizado",
      "statusCode": 404,
    });
  });

  it('deve retornar bad request ao cadastrar usuário com cep inválido /users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'teste',
        email: 'teste@teste.com',
        password: '123123',
        cep: '00'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "Bad Request",
      "message": "CEP inválido",
      "statusCode": 400,
    });
  });

  it('deve retornar sucesso ao atualizar usuário /users (PATCH)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'teste',
        email: 'teste@teste.com',
        password: '123123',
        cep: '07020321'
      });

    const response = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        nome: 'teste-update',
        email: 'teste-update@teste.com',
        password: '123123',
        cep: '00'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "generatedMaps": [],
      "raw": [],
      "affected": 1
    });
  });

  it('deve retornar NotFound ao atualizar usuário /users (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/2')
      .send({
        nome: 'teste-update',
        email: 'teste-update@teste.com',
        password: '123123',
        cep: '00'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      "error": "Not Found",
      "message": "Usuário não encontrado!",
      "statusCode": 404,
    });
  });

  it('deve retornar sucesso ao excluir usuário /users (DELETE)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'teste',
        email: 'teste@teste.com',
        password: '123123',
        cep: '07020321'
      });

    const response = await request(app.getHttpServer())
      .delete('/users/1')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "raw": [],
      "affected": 1
    });
  });

  it('deve retornar NotFound ao excluir usuário /users (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/2')
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      "error": "Not Found",
      "message": "Usuário não encontrado!",
      "statusCode": 404,
    });
  });
});