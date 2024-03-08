import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CepService } from "../consulta-cep/consulta-cep.service";
import { CidadeResponseDto } from "../consulta-cep/dto/cidade-response.dto";
import { itReturnCity, itServiceDefined, itThrowBadRequestException, itThrowNotFoundException } from "./interface-consulta-cep";
import { ICepService } from "../consulta-cep/consulta-cep";

describe('Consumo de API CEP', () => {
  let service: ICepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICepService,
          useClass: CepService,
        }
      ]
    }).compile();

    service = module.get<ICepService>(ICepService);
  });

  it('service definido', () => {
    itServiceDefined(service);
  });

  it('retorna cidade, estado e logradouro válidos passando CEP', async () => {
    await itReturnCity(service);
  });

  it('retorna not found exception caso cep não seja encontrado', async () => {
    await itThrowNotFoundException(service);
  });

  it('retorna bad request excpetion caso cep seja inválido', async () => {
    await itThrowBadRequestException(service);
  });
})