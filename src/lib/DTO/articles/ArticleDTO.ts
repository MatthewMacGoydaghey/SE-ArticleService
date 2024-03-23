import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";



export class ArticleDTO {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string
}