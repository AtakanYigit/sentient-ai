import { Column, Entity, Index } from "typeorm";

@Index("Hormones_pkey", ["id"], { unique: true })
@Entity("Hormones", { schema: "public" })
export class Hormones {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("integer", { name: "level" })
  level: number;
}
