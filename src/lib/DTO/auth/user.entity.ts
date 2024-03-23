import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class User {
@ApiProperty()
@PrimaryGeneratedColumn()
id: number

@ApiProperty()
@Column()
userName: string

@ApiProperty()
@Column()
password: string
}
